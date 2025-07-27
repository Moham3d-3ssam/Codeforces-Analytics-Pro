# 🔍 Codeforces Analytics Pro

A powerful browser extension that provides comprehensive analytics for Codeforces users, including topic-wise accuracy tracking, contest progress analysis, and performance insights.

## ✨ Features

### 📊 Topic-wise Analytics
- **Accuracy Analysis**: Calculate success rate for each of the 36 problem topics
- **Problem Distribution**: Visual breakdown of solved vs available problems by topic
- **First Attempt Success**: Track problems solved on first try
- **Real-time Data**: Problem counts fetched live from Codeforces API

### 🏆 Contest Progress
- **Rating History**: Interactive chart showing rating progression over time
- **Contest Statistics**: Total contests participated, current and max rating
- **Performance Tracking**: Detailed contest performance metrics

### 📈 Visual Analytics
- **Interactive Charts**: Bar charts, pie charts, and line graphs using Chart.js
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Beautiful, gradient-based interface with smooth animations

### 🎯 All 36 Topics Covered
- 2-sat, binary search, bitmasks, brute force, chinese remainder theorem
- combinatorics, constructive algorithms, data structures, dfs and similar
- divide and conquer, dp, dsu, expression parsing, fft, flows
- games, geometry, graph matchings, graphs, greedy, hashing
- implementation, interactive, math, matrices, meet-in-the-middle
- number theory, probabilities, schedules, shortest paths, sortings
- string suffix structures, strings, ternary search, trees, two pointers

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

## 🔧 Usage

### For Any User Profile

1. **Navigate to Profile**
   - Go to any Codeforces user profile: `https://codeforces.com/profile/[username]`

2. **Access Analytics**
   - Look for the "📊 Analytics" button (usually appears in the user info section)
   - Click to view comprehensive topic-wise statistics
   - Click "🏆 Contest Progress" for contest analytics

3. **Interpret Results**
   - **Accuracy Chart**: Shows success rate for each topic you've attempted
   - **Solved vs Total**: Compares your solved problems to total available problems
   - **Topic Distribution**: Pie chart showing your problem-solving distribution
   - **Rating Progress**: Line chart of your contest rating over time

### Understanding the Data

- **Attempted**: Number of problems you've submitted for each topic
- **Solved**: Number of problems you've successfully solved
- **Accuracy**: (Solved / Attempted) × 100%
- **First Attempt**: Problems solved on the very first submission
- **Total in CF**: Live count of all problems available on Codeforces for each topic

## 🛠️ Technical Details

### Files Structure
```
codeforces-analytics-pro/
├── manifest.json          # Extension configuration
├── content.js            # Main functionality and API calls
├── styles.css           # Modern styling and responsive design
├── chart.min.js         # Chart.js library (bundled locally for CSP compliance)
├── icon16.png           # 16x16 extension icon
├── icon48.png           # 48x48 extension icon
├── icon128.png          # 128x128 extension icon
└── README.md            # This file
```

### APIs Used
- **Codeforces API**: 
  - `user.status` - Fetch user submissions
  - `user.info` - Get user information
  - `user.rating` - Contest rating history
  - `problemset.problems` - All problems and their tags (for live counts)

### Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Brave
- ✅ Any Chromium-based browser

### Permissions Required
- `activeTab`: To interact with Codeforces pages
- `storage`: To cache problem counts for better performance
- Host permissions for `codeforces.com` and `codeforces.ru`

## 🔍 Troubleshooting

### Extension Doesn't Show Buttons
1. **Check URL**: Make sure you're on a Codeforces profile page
2. **Refresh Page**: Try refreshing the page after installing
3. **Check Console**: Open DevTools (F12) and check for errors
4. **CSP Issues**: If you see Content Security Policy errors, make sure you're using the latest version with bundled Chart.js

### "Could not detect user" Error
1. **Profile Page**: Ensure you're on `/profile/username` page
2. **Valid Username**: Check that the username exists
3. **Page Load**: Wait for page to fully load before clicking

### API Errors
1. **Network Issues**: Check your internet connection
2. **Rate Limiting**: Codeforces API has rate limits; wait a moment and retry
3. **Invalid Handle**: Ensure the username is spelled correctly

### Performance Issues
1. **Large Submission Count**: Users with 10,000+ submissions may take longer to load
2. **Slow Network**: API calls may timeout on slow connections
3. **Cache**: The extension caches problem counts for 24 hours to improve performance

## 🎨 Customization

### Modifying Styles
Edit `styles.css` to customize:
- Colors and gradients
- Button styles
- Modal appearance
- Chart layouts

### Adding Features
Edit `content.js` to add:
- New chart types
- Additional statistics
- Different analysis methods
- Enhanced UI elements

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

## 📄 License

This project is open source and available under the MIT License.

## 🙋‍♂️ Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Open browser DevTools (F12) to check for errors
3. Try disabling other extensions temporarily
4. Ensure you have the latest version

---

**Made with ❤️ for the Codeforces community**

*This extension helps competitive programmers track their progress and identify areas for improvement across all problem topics.*