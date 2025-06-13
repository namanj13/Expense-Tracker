# 💰 Expense Tracker

<div align="center">
  
### 📊 Track • Analyze • Manage

A simple, browser-based application for tracking personal income and expenses with visual analytics.

</div>

---

## 📋 Overview

Expense Tracker is a lightweight financial management tool built with HTML, CSS, and JavaScript. It helps you:

- 💵 Track income and expenses
- 📊 Visualize spending patterns
- 🗂️ Categorize transactions
- 💾 Store data locally in your browser

The application works entirely in the browser with no server requirements, making it easy to use on any device with a modern web browser.

---

## ✨ Features

### 💼 Core Features
- ➕ Add income and expense transactions
- 🏷️ Categorize transactions for better organization
- 📜 View complete transaction history
- 🔍 Filter transactions by type or category
- 📊 Real-time financial summary dashboard

### 📈 Visual Analytics
- 🥧 Pie chart for expense category breakdown
- 📉 Line chart for monthly income vs expense trends
- 🔍 Interactive chart elements with tooltips

### 💾 Data Management
- 📤 Export data to JSON file for backup
- 📥 Import data from previously exported files
- 🗑️ Clear all data with confirmation

---

## 🛠️ Technologies Used

\`\`\`
📄 HTML5      → Page structure and elements
🎨 CSS3       → Styling and responsive design
⚙️ JavaScript → Application logic and interactivity
📊 Chart.js   → Data visualization
💾 LocalStorage → Client-side data storage
🔣 Font Awesome → Icons
\`\`\`

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1️⃣ Clone the repository
\`\`\`bash
git clone [https://github.com/namanj13/Expense-Tracker]
\`\`\`

2️⃣ Open the project
\`\`\`bash
cd expense-tracker
\`\`\`

3️⃣ Launch the application by opening `index.html` in your browser

---

## 📱 Usage Guide

### 💸 Adding Transactions

<table>
  <tr>
    <td>1️⃣</td>
    <td>Select transaction type (Income/Expense)</td>
  </tr>
  <tr>
    <td>2️⃣</td>
    <td>Enter a description</td>
  </tr>
  <tr>
    <td>3️⃣</td>
    <td>Enter the amount</td>
  </tr>
  <tr>
    <td>4️⃣</td>
    <td>Select a category</td>
  </tr>
  <tr>
    <td>5️⃣</td>
    <td>Choose a date</td>
  </tr>
  <tr>
    <td>6️⃣</td>
    <td>Click "Add Transaction"</td>
  </tr>
</table>

### 📊 Dashboard Elements

- 💹 **Total Income**: Sum of all your income transactions
- 📉 **Total Expenses**: Sum of all your expense transactions
- 💰 **Net Balance**: Your current financial position

### 🔍 Managing Data

- 🔎 **Filter**: Use dropdown filters to view specific transactions
- 🗑️ **Delete**: Remove individual transactions with the trash icon
- 📤 **Export**: Backup your data using the Export button
- 📥 **Import**: Restore data using the Import button
- 🧹 **Clear All**: Remove all transactions at once

---

## ✏️ Customization

### 🏷️ Adding Categories

Edit the categories in `script.js`:
\`\`\`javascript
this.categories = {
  income: ["Salary", "Freelance", "Investment", "Your New Category"],
  expense: ["Food", "Transportation", "Your New Category"]
}
\`\`\`

### 🎨 Changing Colors

Modify the CSS variables in `styles.css`:
\`\`\`css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.income-card .card-icon {
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.expense-card .card-icon {
  background: linear-gradient(135deg, #f56565, #e53e3e);
}
\`\`\`

---

## 🌐 Browser Compatibility

<table>
  <tr>
    <th>Browser</th>
    <th>Support</th>
  </tr>
  <tr>
    <td>Chrome</td>
    <td>✅ Fully Supported</td>
  </tr>
  <tr>
    <td>Firefox</td>
    <td>✅ Fully Supported</td>
  </tr>
  <tr>
    <td>Safari</td>
    <td>✅ Fully Supported</td>
  </tr>
  <tr>
    <td>Edge</td>
    <td>✅ Fully Supported</td>
  </tr>
</table>

---

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

---


## 👨‍💻 Author

**Your Name**
- 🌐 GitHub: [namanj13](https://github.com/namanj13)
- 📧 Email: namanju931@gmail.com

---

## 🌟 Acknowledgments

- 📊 Chart.js for the charting library
- 🔣 Font Awesome for the icons
- 📚 MDN Web Docs for reference and documentation

---

<div align="center">

### 💡 Quick Tips

**💾 Export regularly** to avoid data loss
**📊 Check your charts** to understand spending patterns
**🏷️ Use categories** for better financial insights

<br>

**Made with ❤️ by Naman Jain**

</div>
