# 🔍 Codeforces Analytics Pro

A powerful browser extension that provides comprehensive analytics for Codeforces users, including topic-wise accuracy tracking, contest progress analysis, and performance insights.

## ✨ Features

### 📊 Topic-wise Analytics
- **Accuracy Analysis**: Calculate success rate for each of the 36 problem topics
- **Problem Distribution**: Visual breakdown of solved vs available problems by topic
- **First Attempt Success**: Track problems solved on first try
- **Real-time Data**: Problem counts fetched live from Codeforces API
<img width="1125" height="553" alt="01" src="https://github.com/user-attachments/assets/67c30e6a-143b-46a3-881b-c43b89649c05" />

### 🎯 All 36 Topics Covered
- 2-sat, binary search, bitmasks, brute force, chinese remainder theorem
- combinatorics, constructive algorithms, data structures, dfs and similar
- divide and conquer, dp, dsu, expression parsing, fft, flows
- games, geometry, graph matchings, graphs, greedy, hashing
- implementation, interactive, math, matrices, meet-in-the-middle
- number theory, probabilities, schedules, shortest paths, sortings
- string suffix structures, strings, ternary search, trees, two pointers
<img width="1516" height="852" alt="02" src="https://github.com/user-attachments/assets/b4092319-8924-4ac5-8e66-7833d6d3b5d2" />
<img width="1520" height="856" alt="03" src="https://github.com/user-attachments/assets/0c415061-b3bc-4434-80e7-70b629c25d64" />
<img width="1517" height="856" alt="04" src="https://github.com/user-attachments/assets/4ce4ae2b-b4c3-4fef-873a-2d8ebfc4b5af" />

### 🏆 Contest Progress
- **Rating History**: Interactive chart showing rating progression over time
- **Contest Statistics**: Total contests participated, current and max rating
- **Performance Tracking**: Detailed contest performance metrics  
<img width="1521" height="848" alt="05" src="https://github.com/user-attachments/assets/81f9eb2f-f239-4603-b9e6-48283c9ed433" />

### 📈 Visual Analytics
- **Interactive Charts**: Bar charts, pie charts, and line graphs using Chart.js
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Beautiful, gradient-based interface with smooth animations

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. **Download the Extension**
   ```bash
   # Clone or download all files to a folder
   git clone <repository-url> codeforces-analytics-pro
   cd codeforces-analytics-pro
   ```

2. **Open Chrome/Edge Extension Management**
   - Open Chrome/Edge browser
   - Navigate to `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
   - Enable "Developer mode" (toggle in top right)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

4. **Verify Installation**
   - Visit any Codeforces profile page (e.g., `https://codeforces.com/profile/tourist`)
   - You should see two new buttons: "📊 Analytics" and "🏆 Contest Progress"

### Method 2: Create Extension Package

If you want to package the extension:

```bash
# Create a ZIP file with all extension files
zip -r codeforces-analytics-pro.zip manifest.json content.js styles.css *.png *.svg README.md
```

Then load the ZIP file through Chrome's extension management page.

## 📊 Features Breakdown

### ✅ Implemented Features
1. ✅ Topic-wise accuracy calculation for all 36 topics
2. ✅ Live problem counts from Codeforces API
3. ✅ Analytics button integration on profile pages
4. ✅ Contest progress tracking with rating charts
5. ✅ Responsive modal design with multiple chart types
6. ✅ Error handling and user-friendly messages
7. ✅ Caching system for improved performance
8. ✅ Support for both solved and unsolved topics

### 🔄 Auto-Updates
- **Problem Counts**: Automatically updates daily from API
- **Cache Management**: Smart caching with 24-hour refresh
- **Fallback System**: Uses backup data if API is unavailable

## 🤝 Contributing

To contribute to this extension:

1. Fork the repository
2. Make your changes
3. Test thoroughly on different Codeforces profiles
4. Submit a pull request

## 🙋‍♂️ Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Open browser DevTools (F12) to check for errors
3. Try disabling other extensions temporarily
4. Ensure you have the latest version

---

**Made with ❤️ for the Codeforces community**

*This extension helps competitive programmers track their progress and identify areas for improvement across all problem topics.*
