(function() {
    'use strict';
    
    // Debug: Check if SimpleChart is loaded immediately
    console.log('Extension script loaded. SimpleChart available:', !!window.Chart);

    // All 36 topics as specified
    const ALL_TOPICS = [
        '2-sat', 'binary search', 'bitmasks', 'brute force', 'chinese remainder theorem',
        'combinatorics', 'constructive algorithms', 'data structures', 'dfs and similar',
        'divide and conquer', 'dp', 'dsu', 'expression parsing', 'fft', 'flows',
        'games', 'geometry', 'graph matchings', 'graphs', 'greedy', 'hashing',
        'implementation', 'interactive', 'math', 'matrices', 'meet-in-the-middle',
        'number theory', 'probabilities', 'schedules', 'shortest paths', 'sortings',
        'string suffix structures', 'strings', 'ternary search', 'trees', 'two pointers'
    ];

    // Topic problem counts - will be fetched from API
    let TOPIC_PROBLEM_COUNTS = {};
    let problemCountsLoaded = false;

    let currentUser = null;
    let userStats = null;
    let chartInstance = null;

    // Initialize the extension
    async function init() {
        try {
            // Check if SimpleChart is available
            await checkSimpleChart();
            detectCurrentUser();
            loadTopicProblemCounts();
            if (isProfilePage() || isUserPage()) {
                addAnalyticsButton();
            }
        } catch (error) {
            console.error('Failed to initialize extension:', error);
            // Add buttons anyway, charts will show error messages
            detectCurrentUser();
            if (isProfilePage() || isUserPage()) {
                addAnalyticsButton();
            }
        }
    }

    // Simple check for our chart library
    function checkSimpleChart() {
        if (window.Chart) {
            console.log('SimpleChart is available');
            return Promise.resolve();
        } else {
            console.error('SimpleChart is not loaded');
            return Promise.reject(new Error('SimpleChart is not available'));
        }
    }

    // Load topic problem counts from Codeforces API
    async function loadTopicProblemCounts() {
        if (problemCountsLoaded) return;
        
        // First try to load from cache
        const cached = localStorage.getItem('cf_topic_counts');
        if (cached) {
            try {
                const cachedData = JSON.parse(cached);
                const cacheAge = Date.now() - cachedData.timestamp;
                
                // Use cache if less than 24 hours old
                if (cacheAge < 24 * 60 * 60 * 1000) {
                    TOPIC_PROBLEM_COUNTS = cachedData.data;
                    problemCountsLoaded = true;
                    console.log('Using cached topic counts');
                    return;
                }
            } catch (e) {
                console.error('Error parsing cached data:', e);
            }
        }
        
        try {
            // Fetch all problems from Codeforces API
            const response = await fetch('https://codeforces.com/api/problemset.problems');
            const data = await response.json();
            
            if (data.status !== 'OK') {
                throw new Error('API returned error status');
            }

            // Count problems by tag
            const tagCounts = {};
            ALL_TOPICS.forEach(topic => {
                tagCounts[topic] = 0;
            });

            data.result.problems.forEach(problem => {
                if (problem.tags) {
                    problem.tags.forEach(tag => {
                        if (tagCounts.hasOwnProperty(tag)) {
                            tagCounts[tag]++;
                        }
                    });
                }
            });

            TOPIC_PROBLEM_COUNTS = tagCounts;
            problemCountsLoaded = true;
            
            console.log('Topic problem counts loaded from API:', TOPIC_PROBLEM_COUNTS);
            
            // Store in localStorage for caching
            localStorage.setItem('cf_topic_counts', JSON.stringify({
                data: TOPIC_PROBLEM_COUNTS,
                timestamp: Date.now()
            }));
            
        } catch (error) {
            console.error('Error loading topic problem counts from API:', error);
            
            // Fallback to default values if all else fails
            console.log('Using fallback topic counts');
            TOPIC_PROBLEM_COUNTS = {
                '2-sat': 45, 'binary search': 230, 'bitmasks': 180, 'brute force': 890,
                'chinese remainder theorem': 25, 'combinatorics': 340, 'constructive algorithms': 680,
                'data structures': 450, 'dfs and similar': 520, 'divide and conquer': 95,
                'dp': 890, 'dsu': 180, 'expression parsing': 15, 'fft': 35, 'flows': 120,
                'games': 280, 'geometry': 340, 'graph matchings': 45, 'graphs': 650,
                'greedy': 980, 'hashing': 220, 'implementation': 1200, 'interactive': 85,
                'math': 1100, 'matrices': 45, 'meet-in-the-middle': 35, 'number theory': 450,
                'probabilities': 180, 'schedules': 25, 'shortest paths': 180, 'sortings': 280,
                'string suffix structures': 85, 'strings': 680, 'ternary search': 35,
                'trees': 580, 'two pointers': 340
            };
            problemCountsLoaded = true;
        }
    }

    // Detect current user from the page
    function detectCurrentUser() {
        const userLinks = document.querySelectorAll('a[href*="/profile/"]');
        if (userLinks.length > 0) {
            const href = userLinks[0].getAttribute('href');
            currentUser = href.split('/profile/')[1];
        }
    }

    // Check if we're on a profile page
    function isProfilePage() {
        return window.location.pathname.includes('/profile/');
    }

    // Check if we're on a user page
    function isUserPage() {
        return window.location.pathname.includes('/profile/') || 
               document.querySelector('.main-info .userbox') !== null;
    }

    // Add analytics button to the page
    function addAnalyticsButton() {
        const existingButton = document.getElementById('cf-analytics-btn');
        if (existingButton) return;

        const button = document.createElement('button');
        button.id = 'cf-analytics-btn';
        button.className = 'cf-analytics-button';
        button.innerHTML = '📊 Analytics';
        button.onclick = showAnalyticsModal;

        // Add contest progress button
        const contestButton = document.createElement('button');
        contestButton.id = 'cf-contest-btn';
        contestButton.className = 'cf-analytics-button';
        contestButton.innerHTML = '🏆 Contest Progress';
        contestButton.onclick = showContestModal;

        // Find insertion point
        const userInfo = document.querySelector('.main-info') || 
                        document.querySelector('.userbox') ||
                        document.querySelector('#sidebar');
        
        if (userInfo) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'cf-button-container';
            buttonContainer.appendChild(button);
            buttonContainer.appendChild(contestButton);
            userInfo.appendChild(buttonContainer);
        }
    }

    // Show analytics modal
    async function showAnalyticsModal() {
        showLoadingModal('Loading analytics...');
        
        try {
            const user = getCurrentPageUser();
            console.log('Current user for analytics:', user);
            
            if (!user) {
                showErrorModal('Could not detect user. Please navigate to a user profile page.');
                return;
            }

            // Ensure SimpleChart is loaded
            if (!window.Chart) {
                throw new Error('SimpleChart is not available. Please reload the page.');
            }

            // Ensure topic counts are loaded before proceeding
            if (!problemCountsLoaded) {
                console.log('Loading topic counts...');
                await loadTopicProblemCounts();
            }

            console.log('Fetching user stats for:', user);
            const stats = await fetchUserStats(user);
            console.log('User stats received:', stats);
            
            displayAnalyticsModal(stats, user);
        } catch (error) {
            console.error('Error in showAnalyticsModal:', error);
            showErrorModal(`Failed to load analytics: ${error.message}`);
        }
    }

    // Show contest progress modal
    async function showContestModal() {
        showLoadingModal('Loading contest data...');
        
        try {
            const user = getCurrentPageUser();
            console.log('Current user for contest data:', user);
            
            if (!user) {
                showErrorModal('Could not detect user. Please navigate to a user profile page.');
                return;
            }

            // Ensure SimpleChart is loaded
            if (!window.Chart) {
                throw new Error('SimpleChart is not available. Please reload the page.');
            }

            console.log('Fetching contest stats for:', user);
            const contestStats = await fetchContestStats(user);
            console.log('Contest stats received:', contestStats);
            
            displayContestModal(contestStats, user);
        } catch (error) {
            console.error('Error in showContestModal:', error);
            showErrorModal(`Failed to load contest data: ${error.message}`);
        }
    }

    // Get current page user
    function getCurrentPageUser() {
        const path = window.location.pathname;
        if (path.includes('/profile/')) {
            const username = path.split('/profile/')[1].split('/')[0].split('?')[0];
            console.log('Detected user from URL:', username);
            return username;
        }
        
        // Try to extract from page elements
        const handleElement = document.querySelector('.userbox .object-name') ||
                             document.querySelector('.main-info .title') ||
                             document.querySelector('.info .main-info .title') ||
                             document.querySelector('a[href*="/profile/"]');
        
        if (handleElement) {
            let username = handleElement.textContent.trim();
            if (handleElement.href && handleElement.href.includes('/profile/')) {
                username = handleElement.href.split('/profile/')[1].split('/')[0].split('?')[0];
            }
            console.log('Detected user from page element:', username);
            return username;
        }
        
        console.log('Using current user:', currentUser);
        return currentUser;
    }

    // Fetch user statistics
    async function fetchUserStats(handle) {
        try {
            console.log(`Fetching submissions for handle: ${handle}`);
            
            // Fetch submissions
            const submissionsResponse = await fetch(
                `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
            );
            
            if (!submissionsResponse.ok) {
                throw new Error(`HTTP ${submissionsResponse.status}: ${submissionsResponse.statusText}`);
            }
            
            const submissionsData = await submissionsResponse.json();
            console.log('Submissions API response:', submissionsData);
            
            if (submissionsData.status !== 'OK') {
                throw new Error(`Submissions API Error: ${submissionsData.comment || 'Unknown error'}`);
            }

            // Fetch user info
            console.log(`Fetching user info for handle: ${handle}`);
            const userResponse = await fetch(
                `https://codeforces.com/api/user.info?handles=${handle}`
            );
            
            if (!userResponse.ok) {
                throw new Error(`HTTP ${userResponse.status}: ${userResponse.statusText}`);
            }
            
            const userData = await userResponse.json();
            console.log('User info API response:', userData);
            
            if (userData.status !== 'OK') {
                throw new Error(`User info API Error: ${userData.comment || 'Unknown error'}`);
            }

            const submissions = submissionsData.result || [];
            const userInfo = userData.result?.[0] || { handle: handle };

            console.log(`Processing ${submissions.length} submissions for analysis`);
            const analysisResult = analyzeSubmissions(submissions, userInfo);
            console.log('Analysis result:', analysisResult);
            
            return analysisResult;
        } catch (error) {
            console.error('Error in fetchUserStats:', error);
            throw new Error(`Failed to fetch data: ${error.message}`);
        }
    }

    // Fetch contest statistics
    async function fetchContestStats(handle) {
        try {
            console.log(`Fetching contest stats for handle: ${handle}`);
            
            const response = await fetch(
                `https://codeforces.com/api/user.rating?handle=${handle}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Contest API response:', data);
            
            if (data.status !== 'OK') {
                // If user has no contest participation, return empty data instead of error
                if (data.comment && data.comment.includes('not found')) {
                    console.log('User has no contest participation');
                    return analyzeContestData([]);
                }
                throw new Error(`Contest API Error: ${data.comment || 'Unknown error'}`);
            }

            const contestHistory = data.result || [];
            console.log(`Processing ${contestHistory.length} contest records`);
            
            const analysisResult = analyzeContestData(contestHistory);
            console.log('Contest analysis result:', analysisResult);
            
            return analysisResult;
        } catch (error) {
            console.error('Error in fetchContestStats:', error);
            
            // For contest stats, if API fails, return empty data rather than throwing
            if (error.message.includes('not found') || error.message.includes('404')) {
                console.log('User has no contest data, returning empty stats');
                return analyzeContestData([]);
            }
            
            throw new Error(`Failed to fetch contest data: ${error.message}`);
        }
    }

    // Analyze submissions for topic-wise statistics
    function analyzeSubmissions(submissions, userInfo) {
        console.log('Analyzing submissions:', submissions?.length || 0, 'submissions');
        
        const topicStats = {};
        const solvedProblems = new Set();
        
        // Initialize topic stats
        ALL_TOPICS.forEach(topic => {
            topicStats[topic] = {
                attempted: 0,
                solved: 0,
                firstAttemptSolved: 0,
                accuracy: 0,
                problemCount: TOPIC_PROBLEM_COUNTS[topic] || 0
            };
        });

        // Handle empty or null submissions
        if (!submissions || submissions.length === 0) {
            console.log('No submissions to analyze');
            return {
                topicStats,
                userInfo: userInfo || {},
                totalSolved: 0,
                totalSubmissions: 0
            };
        }

        // Track problem attempts
        const problemAttempts = {};
        
        submissions.forEach((submission, index) => {
            try {
                const problem = submission.problem;
                if (!problem) {
                    console.warn(`Submission ${index} has no problem data`);
                    return;
                }
                
                const problemKey = `${problem.contestId}-${problem.index}`;
                const verdict = submission.verdict;
                const tags = problem.tags || [];

                // Initialize problem tracking
                if (!problemAttempts[problemKey]) {
                    problemAttempts[problemKey] = {
                        tags: tags,
                        attempts: 0,
                        solved: false,
                        firstAttemptSolved: false
                    };
                }

                problemAttempts[problemKey].attempts++;
                
                if (verdict === 'OK') {
                    if (!problemAttempts[problemKey].solved) {
                        problemAttempts[problemKey].solved = true;
                        if (problemAttempts[problemKey].attempts === 1) {
                            problemAttempts[problemKey].firstAttemptSolved = true;
                        }
                        solvedProblems.add(problemKey);
                    }
                }
            } catch (error) {
                console.warn(`Error processing submission ${index}:`, error);
            }
        });

        console.log('Problem attempts processed:', Object.keys(problemAttempts).length);

        // Calculate topic statistics
        Object.values(problemAttempts).forEach(problem => {
            problem.tags.forEach(tag => {
                if (topicStats[tag]) {
                    topicStats[tag].attempted++;
                    if (problem.solved) {
                        topicStats[tag].solved++;
                        if (problem.firstAttemptSolved) {
                            topicStats[tag].firstAttemptSolved++;
                        }
                    }
                }
            });
        });

        // Calculate accuracy percentages
        Object.keys(topicStats).forEach(topic => {
            const stats = topicStats[topic];
            if (stats.attempted > 0) {
                stats.accuracy = Math.round((stats.solved / stats.attempted) * 100);
            }
        });

        const result = {
            topicStats,
            userInfo: userInfo || {},
            totalSolved: solvedProblems.size,
            totalSubmissions: submissions.length
        };
        
        console.log('Analysis complete. Topics with attempts:', 
                   Object.entries(topicStats).filter(([_, stats]) => stats.attempted > 0).length);
        
        return result;
    }

    // Analyze contest data
    function analyzeContestData(contests) {
        if (!contests || contests.length === 0) {
            return {
                contestsParticipated: 0,
                currentRating: 0,
                maxRating: 0,
                ratingChange: [],
                contestHistory: []
            };
        }

        const currentRating = contests[contests.length - 1].newRating;
        const maxRating = Math.max(...contests.map(c => c.newRating));
        
        return {
            contestsParticipated: contests.length,
            currentRating,
            maxRating,
            ratingChange: contests.map(c => c.newRating - c.oldRating),
            contestHistory: contests
        };
    }

    // Display analytics modal
    function displayAnalyticsModal(stats, user) {
        // Remove any existing modal
        const existingModal = document.querySelector('.cf-modal-overlay');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        const modal = createModal(`📊 Analytics for ${user}`, createAnalyticsContent(stats));
        document.body.appendChild(modal);
    }

    // Display contest modal
    function displayContestModal(contestStats, user) {
        // Remove any existing modal
        const existingModal = document.querySelector('.cf-modal-overlay');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        const modal = createModal(`🏆 Contest Progress for ${user}`, createContestContent(contestStats));
        document.body.appendChild(modal);
    }

    // Create analytics content with new layout
    function createAnalyticsContent(stats) {
        const container = document.createElement('div');
        container.className = 'cf-analytics-content';

        // User summary with detailed breakdown
        const summary = document.createElement('div');
        summary.className = 'cf-summary';
        
        // Calculate different problem sources
        const problemsetSolved = stats.totalSolved; // This is from regular problemset
        const totalSubmissions = stats.totalSubmissions;
        const currentRating = stats.userInfo.rating || 'Unrated';
        
        summary.innerHTML = `
            <div class="cf-summary-item">
                <span class="cf-label">Problems Solved (Problemset):</span>
                <span class="cf-value">${problemsetSolved}</span>
            </div>
            <div class="cf-summary-item">
                <span class="cf-label">Total Submissions:</span>
                <span class="cf-value">${totalSubmissions}</span>
            </div>
            <div class="cf-summary-item">
                <span class="cf-label">Current Rating:</span>
                <span class="cf-value">${currentRating}</span>
            </div>
        `;

        // Separate solved and unsolved topics
        const solvedTopics = [];
        const unsolvedTopics = [];
        
        ALL_TOPICS.forEach(topic => {
            const topicData = stats.topicStats[topic];
            if (topicData && topicData.solved > 0) {
                solvedTopics.push({
                    name: topic,
                    solved: topicData.solved,
                    total: topicData.problemCount,
                    accuracy: topicData.accuracy,
                    attempted: topicData.attempted
                });
            } else {
                unsolvedTopics.push(topic);
            }
        });

        // Solved topics section
        const solvedSection = document.createElement('div');
        solvedSection.className = 'cf-topics-section';
        solvedSection.innerHTML = `
            <h3 class="cf-section-title">🎯 Solved Topics (${solvedTopics.length}/36)</h3>
            <div class="cf-topics-grid" id="cf-solved-topics"></div>
        `;

        // Unsolved topics section
        const unsolvedSection = document.createElement('div');
        unsolvedSection.className = 'cf-topics-section';
        unsolvedSection.innerHTML = `
            <h3 class="cf-section-title">📚 Opportunity Topics (${unsolvedTopics.length}/36)</h3>
            <div class="cf-unsolved-topics" id="cf-unsolved-topics"></div>
        `;

        container.appendChild(summary);
        container.appendChild(solvedSection);
        container.appendChild(unsolvedSection);

        // Populate solved topics after DOM insertion
        setTimeout(() => {
            populateSolvedTopics(solvedTopics);
            populateUnsolvedTopics(unsolvedTopics);
        }, 100);

        return container;
    }

    // Populate solved topics with interactive cards
    function populateSolvedTopics(solvedTopics) {
        const container = document.getElementById('cf-solved-topics');
        if (!container) return;

        // Sort by number of problems solved (descending)
        solvedTopics.sort((a, b) => b.solved - a.solved);

        solvedTopics.forEach((topic, index) => {
            const percentage = topic.total > 0 ? Math.round((topic.solved / topic.total) * 100) : 0;
            
            const topicCard = document.createElement('div');
            topicCard.className = 'cf-topic-card cf-solved-card';
            topicCard.style.animationDelay = `${index * 50}ms`;
            
            topicCard.innerHTML = `
                <div class="cf-topic-header">
                    <h4 class="cf-topic-name">${topic.name}</h4>
                    <span class="cf-topic-badge">${percentage}%</span>
                </div>
                <div class="cf-topic-stats">
                    <div class="cf-stat">
                        <span class="cf-stat-label">Solved:</span>
                        <span class="cf-stat-value">${topic.solved}</span>
                    </div>
                    <div class="cf-stat">
                        <span class="cf-stat-label">Total in CF:</span>
                        <span class="cf-stat-value">${topic.total}</span>
                    </div>
                    <div class="cf-stat">
                        <span class="cf-stat-label">Accuracy:</span>
                        <span class="cf-stat-value">${topic.accuracy}%</span>
                    </div>
                </div>
                <div class="cf-progress-bar">
                    <div class="cf-progress-fill" style="width: 0%; animation-delay: ${index * 50 + 300}ms"></div>
                </div>
            `;

            // Add click interaction
            topicCard.addEventListener('click', () => {
                showTopicDetails(topic);
            });

            container.appendChild(topicCard);

            // Animate progress bar
            setTimeout(() => {
                const progressFill = topicCard.querySelector('.cf-progress-fill');
                progressFill.style.width = `${percentage}%`;
            }, index * 50 + 500);
        });
    }

    // Populate unsolved topics
    function populateUnsolvedTopics(unsolvedTopics) {
        const container = document.getElementById('cf-unsolved-topics');
        if (!container) return;

        if (unsolvedTopics.length === 0) {
            container.innerHTML = '<p class="cf-all-solved">🎉 Congratulations! You have solved problems in all 36 topics!</p>';
            return;
        }

        // Create tags for unsolved topics
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'cf-unsolved-tags';

        unsolvedTopics.forEach((topic, index) => {
            const tag = document.createElement('span');
            tag.className = 'cf-unsolved-tag';
            tag.textContent = topic;
            tag.style.animationDelay = `${index * 30}ms`;
            
            // Add click to show topic info
            tag.addEventListener('click', () => {
                showUnsolvedTopicInfo(topic);
            });
            
            tagsContainer.appendChild(tag);
        });

        container.appendChild(tagsContainer);

        // Add suggestion text
        const suggestion = document.createElement('p');
        suggestion.className = 'cf-suggestion';
        suggestion.innerHTML = `💡 <strong>Next Challenge:</strong> Try solving problems from these topics to expand your skill set! Start with <strong>${unsolvedTopics[0]}</strong>.`;
        container.appendChild(suggestion);
    }

    // Show topic details modal
    function showTopicDetails(topic) {
        const modal = document.createElement('div');
        modal.className = 'cf-topic-modal';
        modal.innerHTML = `
            <div class="cf-topic-modal-content">
                <h3>📊 ${topic.name} - Detailed Statistics</h3>
                <div class="cf-topic-details">
                    <div class="cf-detail-row">
                        <span>Problems Solved:</span>
                        <span>${topic.solved} / ${topic.total}</span>
                    </div>
                    <div class="cf-detail-row">
                        <span>Completion Rate:</span>
                        <span>${Math.round((topic.solved / topic.total) * 100)}%</span>
                    </div>
                    <div class="cf-detail-row">
                        <span>Accuracy:</span>
                        <span>${topic.accuracy}%</span>
                    </div>
                    <div class="cf-detail-row">
                        <span>Problems Attempted:</span>
                        <span>${topic.attempted}</span>
                    </div>
                </div>
                <button class="cf-close-topic-modal">Close</button>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('cf-close-topic-modal')) {
                document.body.removeChild(modal);
            }
        });

        document.body.appendChild(modal);
    }

    // Show unsolved topic info
    function showUnsolvedTopicInfo(topic) {
        const totalProblems = TOPIC_PROBLEM_COUNTS[topic] || 0;
        alert(`${topic}\n\nTotal problems available: ${totalProblems}\n\nThis is a great opportunity to learn something new! Try solving a few problems from this topic.`);
    }

    // Create contest content
    function createContestContent(contestStats) {
        const container = document.createElement('div');
        container.className = 'cf-contest-content';

        const summary = document.createElement('div');
        summary.className = 'cf-summary';
        summary.innerHTML = `
            <div class="cf-summary-item">
                <span class="cf-label">Contests Participated:</span>
                <span class="cf-value">${contestStats.contestsParticipated}</span>
            </div>
            <div class="cf-summary-item">
                <span class="cf-label">Current Rating:</span>
                <span class="cf-value">${contestStats.currentRating}</span>
            </div>
            <div class="cf-summary-item">
                <span class="cf-label">Max Rating:</span>
                <span class="cf-value">${contestStats.maxRating}</span>
            </div>
        `;

        const chartContainer = document.createElement('div');
        chartContainer.className = 'cf-chart-container';
        chartContainer.innerHTML = '<h3>Rating Progress</h3>';
        const canvas = document.createElement('canvas');
        canvas.id = 'cf-rating-chart';
        chartContainer.appendChild(canvas);

        container.appendChild(summary);
        container.appendChild(chartContainer);

        setTimeout(() => {
            console.log('Creating rating chart with data:', contestStats.contestHistory);
            try {
                createRatingChart(contestStats.contestHistory);
            } catch (error) {
                console.error('Error creating rating chart:', error);
            }
        }, 500);

        return container;
    }



    // Create rating progress chart
    function createRatingChart(contestHistory) {
        const canvas = document.getElementById('cf-rating-chart');
        console.log('Creating rating chart, canvas:', canvas, 'Chart available:', !!window.Chart, 'History length:', contestHistory?.length);
        
        if (!canvas || !window.Chart) {
            console.error('Cannot create rating chart - missing canvas or SimpleChart');
            return;
        }

        // Set canvas size
        canvas.width = 600;
        canvas.height = 400;

        try {
            const chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: contestHistory.map((_, index) => `${index + 1}`),
                    datasets: [{
                        label: 'Rating',
                        // --- THIS IS THE CHANGE ---
                        // Pass the entire contest history object for each data point
                        data: contestHistory,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            ticks: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
            console.log('Rating chart created successfully');
        } catch (error) {
            console.error('Error creating rating chart:', error);
        }
    }

    // Create modal
    function createModal(title, content) {
        const overlay = document.createElement('div');
        overlay.className = 'cf-modal-overlay';
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        };

        const modal = document.createElement('div');
        modal.className = 'cf-modal';

        const header = document.createElement('div');
        header.className = 'cf-modal-header';
        header.innerHTML = `
            <h2>${title}</h2>
            <button class="cf-close-btn" onclick="this.closest('.cf-modal-overlay').remove()">×</button>
        `;

        const body = document.createElement('div');
        body.className = 'cf-modal-body';
        body.appendChild(content);

        modal.appendChild(header);
        modal.appendChild(body);
        overlay.appendChild(modal);

        return overlay;
    }

    // Show loading modal
    function showLoadingModal(message) {
        const existingModal = document.querySelector('.cf-modal-overlay');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }

        const content = document.createElement('div');
        content.className = 'cf-loading';
        content.innerHTML = `
            <div class="cf-spinner"></div>
            <p>${message}</p>
        `;

        const modal = createModal('Loading...', content);
        document.body.appendChild(modal);
    }

    // Show error modal
    function showErrorModal(message) {
        const existingModal = document.querySelector('.cf-modal-overlay');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }

        const content = document.createElement('div');
        content.className = 'cf-error';
        content.innerHTML = `
            <p>❌ ${message}</p>
            <button onclick="this.closest('.cf-modal-overlay').remove()" class="cf-retry-btn">Close</button>
        `;

        const modal = createModal('Error', content);
        document.body.appendChild(modal);
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Small delay to ensure SimpleChart is loaded
            setTimeout(init, 200);
        });
    } else {
        // Small delay to ensure SimpleChart is loaded
        setTimeout(init, 200);
    }

    // Re-initialize on navigation (for SPA behavior)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000); // Delay to ensure page is loaded
        }
    }).observe(document, { subtree: true, childList: true });

})();