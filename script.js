import { Chart } from "@/components/ui/chart"
// Expense Tracker Application
class ExpenseTracker {
  constructor() {
    // Hide loading indicator
    setTimeout(() => {
      const loadingIndicator = document.getElementById("loadingIndicator")
      if (loadingIndicator) {
        loadingIndicator.style.opacity = "0"
        setTimeout(() => {
          loadingIndicator.remove()
        }, 300)
      }
    }, 500)

    this.transactions = this.loadFromStorage() || []
    this.categories = {
      income: ["Salary", "Freelance", "Investment", "Business", "Other Income"],
      expense: [
        "Food",
        "Transportation",
        "Entertainment",
        "Shopping",
        "Bills",
        "Healthcare",
        "Education",
        "Travel",
        "Other Expense",
      ],
    }
    this.charts = {}
    this.resizeTimeout = null
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.populateCategories()
    this.setDefaultDate()
    this.updateDashboard()
    this.renderTransactions()
    this.initializeCharts()
    this.populateFilterCategories()

    // Add resize handler for responsive charts
    window.addEventListener("resize", () => {
      this.handleResize()
    })
  }

  setupEventListeners() {
    // Form submission
    document.getElementById("transactionForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.addTransaction()
    })

    // Type change to update categories
    document.getElementById("type").addEventListener("change", () => {
      this.populateCategories()
    })

    // Filter changes
    document.getElementById("filterType").addEventListener("change", () => {
      this.renderTransactions()
    })

    document.getElementById("filterCategory").addEventListener("change", () => {
      this.renderTransactions()
    })

    // File input for import
    document.getElementById("fileInput").addEventListener("change", (e) => {
      this.handleFileImport(e)
    })
  }

  populateCategories() {
    const typeSelect = document.getElementById("type")
    const categorySelect = document.getElementById("category")
    const selectedType = typeSelect.value

    categorySelect.innerHTML = ""
    this.categories[selectedType].forEach((category) => {
      const option = document.createElement("option")
      option.value = category
      option.textContent = category
      categorySelect.appendChild(option)
    })
  }

  populateFilterCategories() {
    const filterCategory = document.getElementById("filterCategory")
    const allCategories = [...this.categories.income, ...this.categories.expense]

    filterCategory.innerHTML = '<option value="all">All Categories</option>'
    ;[...new Set(allCategories)].forEach((category) => {
      const option = document.createElement("option")
      option.value = category
      option.textContent = category
      filterCategory.appendChild(option)
    })
  }

  setDefaultDate() {
    const dateInput = document.getElementById("date")
    const today = new Date().toISOString().split("T")[0]
    dateInput.value = today
  }

  addTransaction() {
    const form = document.getElementById("transactionForm")
    const formData = new FormData(form)

    const transaction = {
      id: Date.now().toString(),
      type: formData.get("type") || document.getElementById("type").value,
      description: formData.get("description") || document.getElementById("description").value,
      amount: Number.parseFloat(formData.get("amount") || document.getElementById("amount").value),
      category: formData.get("category") || document.getElementById("category").value,
      date: formData.get("date") || document.getElementById("date").value,
      timestamp: new Date().toISOString(),
    }

    this.transactions.unshift(transaction)
    this.saveToStorage()
    this.updateDashboard()
    this.renderTransactions()
    this.updateCharts()

    // Reset form
    form.reset()
    this.setDefaultDate()
    this.populateCategories()

    // Show success feedback
    this.showNotification("Transaction added successfully!", "success")
  }

  deleteTransaction(id) {
    if (confirm("Are you sure you want to delete this transaction?")) {
      this.transactions = this.transactions.filter((t) => t.id !== id)
      this.saveToStorage()
      this.updateDashboard()
      this.renderTransactions()
      this.updateCharts()
      this.showNotification("Transaction deleted successfully!", "success")
    }
  }

  updateDashboard() {
    const totalIncome = this.transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = this.transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const netBalance = totalIncome - totalExpenses

    document.getElementById("totalIncome").textContent = this.formatCurrency(totalIncome)
    document.getElementById("totalExpenses").textContent = this.formatCurrency(totalExpenses)
    document.getElementById("netBalance").textContent = this.formatCurrency(netBalance)

    // Update balance card color based on positive/negative
    const balanceCard = document.querySelector(".balance-card .amount")
    balanceCard.style.color = netBalance >= 0 ? "#38a169" : "#e53e3e"
  }

  renderTransactions() {
    const container = document.getElementById("transactionsList")
    const filterType = document.getElementById("filterType").value
    const filterCategory = document.getElementById("filterCategory").value

    let filteredTransactions = this.transactions

    if (filterType !== "all") {
      filteredTransactions = filteredTransactions.filter((t) => t.type === filterType)
    }

    if (filterCategory !== "all") {
      filteredTransactions = filteredTransactions.filter((t) => t.category === filterCategory)
    }

    if (filteredTransactions.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <h3>No transactions found</h3>
                    <p>Start by adding your first transaction above.</p>
                </div>
            `
      return
    }

    container.innerHTML = filteredTransactions
      .map(
        (transaction) => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${transaction.type}">
                        <i class="fas fa-${transaction.type === "income" ? "arrow-up" : "arrow-down"}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.description}</h4>
                        <p>${transaction.category} • ${this.formatDate(transaction.date)}</p>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === "income" ? "+" : "-"}${this.formatCurrency(transaction.amount)}
                </div>
                <div class="transaction-actions">
                    <button class="btn btn-danger btn-small" onclick="expenseTracker.deleteTransaction('${transaction.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `,
      )
      .join("")
  }

  initializeCharts() {
    this.initExpenseChart()
    this.initTrendChart()
  }

  initExpenseChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d")
    const expenseData = this.getExpenseByCategory()

    this.charts.expense = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: expenseData.labels,
        datasets: [
          {
            data: expenseData.data,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#C9CBCF"],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: window.innerWidth < 768 ? "bottom" : "right",
            labels: {
              padding: window.innerWidth < 768 ? 15 : 20,
              usePointStyle: true,
              font: {
                size: window.innerWidth < 768 ? 11 : 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = this.formatCurrency(context.parsed)
                const percentage = ((context.parsed / expenseData.total) * 100).toFixed(1)
                return `${label}: ${value} (${percentage}%)`
              },
            },
          },
        },
      },
    })
  }

  initTrendChart() {
    const ctx = document.getElementById("trendChart").getContext("2d")
    const trendData = this.getMonthlyTrend()

    this.charts.trend = new Chart(ctx, {
      type: "line",
      data: {
        labels: trendData.labels,
        datasets: [
          {
            label: "Income",
            data: trendData.income,
            borderColor: "#48bb78",
            backgroundColor: "rgba(72, 187, 120, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: window.innerWidth < 768 ? 3 : 4,
            pointHoverRadius: window.innerWidth < 768 ? 5 : 6,
          },
          {
            label: "Expenses",
            data: trendData.expenses,
            borderColor: "#f56565",
            backgroundColor: "rgba(245, 101, 101, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: window.innerWidth < 768 ? 3 : 4,
            pointHoverRadius: window.innerWidth < 768 ? 5 : 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: window.innerWidth < 768 ? 11 : 12,
              },
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 11,
              },
            },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => this.formatCurrency(value),
            font: {
              size: window.innerWidth < 768 ? 10 : 11,
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      },
    })
  }

  updateCharts() {
    // Update expense chart
    const expenseData = this.getExpenseByCategory()
    this.charts.expense.data.labels = expenseData.labels
    this.charts.expense.data.datasets[0].data = expenseData.data
    this.charts.expense.update()

    // Update trend chart
    const trendData = this.getMonthlyTrend()
    this.charts.trend.data.labels = trendData.labels
    this.charts.trend.data.datasets[0].data = trendData.income
    this.charts.trend.data.datasets[1].data = trendData.expenses
    this.charts.trend.update()
  }

  getExpenseByCategory() {
    const expenses = this.transactions.filter((t) => t.type === "expense")
    const categoryTotals = {}

    expenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    })

    const labels = Object.keys(categoryTotals)
    const data = Object.values(categoryTotals)
    const total = data.reduce((sum, value) => sum + value, 0)

    return { labels, data, total }
  }

  getMonthlyTrend() {
    const monthlyData = {}
    const currentDate = new Date()

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM format
      monthlyData[monthKey] = { income: 0, expenses: 0 }
    }

    this.transactions.forEach((transaction) => {
      const monthKey = transaction.date.slice(0, 7)
      if (monthlyData[monthKey]) {
        monthlyData[monthKey][transaction.type === "income" ? "income" : "expenses"] += transaction.amount
      }
    })

    const labels = Object.keys(monthlyData).map((key) => {
      const date = new Date(key + "-01")
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    })

    const income = Object.values(monthlyData).map((data) => data.income)
    const expenses = Object.values(monthlyData).map((data) => data.expenses)

    return { labels, income, expenses }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  saveToStorage() {
    try {
      localStorage.setItem("expenseTrackerData", JSON.stringify(this.transactions))
    } catch (error) {
      this.showNotification("Error saving data. Storage might be full.", "error")
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem("expenseTrackerData")
      return data ? JSON.parse(data) : []
    } catch (error) {
      this.showNotification("Error loading saved data.", "error")
      return []
    }
  }

  exportData() {
    const dataStr = JSON.stringify(this.transactions, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `expense-tracker-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    this.showNotification("Data exported successfully!", "success")
  }

  importData() {
    document.getElementById("fileInput").click()
  }

  handleFileImport(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)
        if (Array.isArray(importedData)) {
          if (confirm("This will replace all existing data. Are you sure?")) {
            this.transactions = importedData
            this.saveToStorage()
            this.updateDashboard()
            this.renderTransactions()
            this.updateCharts()
            this.showNotification("Data imported successfully!", "success")
          }
        } else {
          throw new Error("Invalid data format")
        }
      } catch (error) {
        this.showNotification("Error importing data. Please check the file format.", "error")
      }
    }
    reader.readAsText(file)

    // Reset file input
    event.target.value = ""
  }

  clearAllData() {
    if (confirm("Are you sure you want to delete all transactions? This action cannot be undone.")) {
      this.transactions = []
      this.saveToStorage()
      this.updateDashboard()
      this.renderTransactions()
      this.updateCharts()
      this.showNotification("All data cleared successfully!", "success")
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
            <span>${message}</span>
        `

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "#48bb78" : type === "error" ? "#f56565" : "#4299e1"};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `

    // Add animation styles
    const style = document.createElement("style")
    style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `
    document.head.appendChild(style)

    document.body.appendChild(notification)

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideIn 0.3s ease reverse"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  handleResize() {
    // Debounce resize events
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => {
      if (this.charts.expense) {
        this.charts.expense.destroy()
      }
      if (this.charts.trend) {
        this.charts.trend.destroy()
      }
      this.initializeCharts()
    }, 250)
  }
}

// Global functions for HTML onclick handlers
function exportData() {
  expenseTracker.exportData()
}

function importData() {
  expenseTracker.importData()
}

function clearAllData() {
  expenseTracker.clearAllData()
}

// Initialize the application
const expenseTracker = new ExpenseTracker()
