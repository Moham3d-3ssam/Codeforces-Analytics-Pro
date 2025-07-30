<img width="1855" height="847" alt="11" src="https://github.com/user-attachments/assets/b093659d-7383-4dca-b157-cb7097bbf424" /># 🔍 Codeforces Analytics Pro

A powerful browser extension that provides comprehensive analytics for Codeforces users, including topic-wise accuracy tracking, contest progress analysis, and performance insights.

## ✨ Features

### 📊 Topic-wise Analytics
- **Accuracy Analysis**: Calculate success rate for each of the 36 problem topics
- **Problem Distribution**: Visual breakdown of solved vs available problems by topic
- **First Attempt Success**: Track problems solved on first try
- **Analytics About Each Month**: Number of solved problems in each tag and in each difficulty level
- **Real-time Data**: Problem counts fetched live from Codeforces API
<img width="1112" height="592" alt="06" src="https://github.com/user-attachments/assets/c0361440-5e76-486f-a8c9-1408e374f4f8" />

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

### 📈 Solved Problems
- Number of solved problems in each topic in this month
- Number of solved problems in each difficulty level
<img width="1522" height="862" alt="10" src="https://github.com/user-attachments/assets/e75cc564-4aab-4cca-91b8-ad4e916f5750" />
<img width="1367" height="860" alt="08" src="https://github.com/user-attachments/assets/3937aa65-bc60-4174-ad7a-4593e4267572" />
<img width="1855" height="847" alt="11" src="https://github.com/user-attachments/assets/763a2106-5e6c-48df-85b7-813fa85c93e2" />



### 🏆 Contest Progress
- **Rating History**: Interactive chart showing rating progression over time
- **Contest Statistics**: Total contests participated, current and max rating
- **Performance Tracking**: Detailed contest performance metrics  
<img width="1667" height="852" alt="09" src="https://github.com/user-attachments/assets/833a8453-986b-4e0d-a9b6-8df0dd8dd2b6" />


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
   - You should see two new buttons: "📊 Analytics", "📈 Solved Problems" and "🏆 Contest Progress"

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
