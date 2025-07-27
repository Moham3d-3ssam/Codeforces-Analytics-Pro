class SimpleChart {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;
        this.width = canvas.width || 400;
        this.height = canvas.height || 300;
        
        // Animation properties
        this.animationProgress = 0;
        this.animationDuration = 2500;
        this.startTime = null;
        this.isAnimating = true;
        
        // --- NEW PROPERTIES FOR TOOLTIP ---
        this.hoveredIndex = -1;
        this.pointCoordinates = []; // To store the [x, y] of each point
        
        // Set canvas size
        canvas.width = this.width;
        canvas.height = this.height;
        
        // Add event listeners for interactivity
        this.addEventListeners();
        
        // Start animation
        this.animate();
    }
    
    addEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleMouseMove(x, y);
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            if (this.hoveredIndex !== -1) {
                this.hoveredIndex = -1;
                this.redraw();
            }
        });
        
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleClick(x, y);
        });
    }
    
    animate() {
        const now = Date.now();
        if (!this.startTime) this.startTime = now;
        
        const elapsed = now - this.startTime;
        this.animationProgress = Math.min(elapsed / this.animationDuration, 1);
        
        // Easing function (ease-out)
        this.animationProgress = 1 - Math.pow(1 - this.animationProgress, 3);
        
        this.draw();
        
        if (this.animationProgress < 1) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    }
    
    redraw() {
        if (!this.isAnimating) {
            this.draw();
        }
    }
    
    // --- MODIFIED to call drawTooltip ---
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        switch (this.config.type) {
            case 'bar':
                this.drawBarChart();
                break;
            case 'line':
                this.drawLineChart();
                break;
            case 'pie':
                this.drawPieChart();
                break;
            default:
                this.drawErrorMessage();
        }

        // If a point is hovered, draw the tooltip on top
        if (this.hoveredIndex !== -1) {
            this.drawTooltip();
        }
    }
    
    drawBarChart() {
        // ... (this function is unchanged)
    }
    
    // --- MODIFIED to handle object data and store point coordinates ---
    drawLineChart() {
        const data = this.config.data;
        const labels = data.labels;
        const datasets = data.datasets;

        if (!labels || !datasets || labels.length === 0) {
            this.drawNoDataMessage();
            return;
        }

        const padding = 40;
        const chartWidth = this.width - 2 * padding;
        const chartHeight = this.height - 2 * padding - 40;

        let maxValue = -Infinity;
        let minValue = Infinity;
        datasets.forEach(dataset => {
            dataset.data.forEach(point => {
                maxValue = Math.max(maxValue, point.newRating);
                minValue = Math.min(minValue, point.newRating);
            });
        });

        if (maxValue === minValue) {
            maxValue += 100;
            minValue -= 100;
        }

        const pointSpacing = labels.length > 1 ? chartWidth / (labels.length - 1) : chartWidth;

        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, padding + chartHeight);
        this.ctx.lineTo(padding + chartWidth, padding + chartHeight);
        this.ctx.stroke();

        this.pointCoordinates = []; // Reset coordinates for this frame

        const totalSegments = labels.length - 1;
        if (totalSegments < 0) return;

        const segmentsToDraw = this.animationProgress * totalSegments;
        const fullyDrawnSegments = Math.floor(segmentsToDraw);
        const lastSegmentProgress = segmentsToDraw - fullyDrawnSegments;

        datasets.forEach((dataset, datasetIndex) => {
            this.ctx.strokeStyle = dataset.borderColor || this.getColor(datasetIndex);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            let lastX, lastY;
            
            // This function calculates and stores coordinates
            const getPointCoords = (index) => {
                const value = dataset.data[index].newRating;
                const x = padding + index * pointSpacing;
                const y = padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
                this.pointCoordinates[index] = { x, y };
                return { x, y };
            };
            
            if (totalSegments === 0) {
                const { x, y } = getPointCoords(0);
                lastX = x;
                lastY = y;
                this.ctx.moveTo(x,y);
            } else {
                for (let i = 0; i <= fullyDrawnSegments; i++) {
                    const { x, y } = getPointCoords(i);
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                    lastX = x;
                    lastY = y;
                }

                if (fullyDrawnSegments < totalSegments) {
                    const { x: nextX, y: nextY } = getPointCoords(fullyDrawnSegments + 1);
                    const interpX = lastX + (nextX - lastX) * lastSegmentProgress;
                    const interpY = lastY + (nextY - lastY) * lastSegmentProgress;
                    this.ctx.lineTo(interpX, interpY);
                }
            }
            
            this.ctx.stroke();

            this.ctx.fillStyle = dataset.borderColor || this.getColor(datasetIndex);
            const pointsToShow = Math.floor(segmentsToDraw) + 1;
            
            for (let i = 0; i < pointsToShow; i++) {
                 const { x, y } = this.pointCoordinates[i] || getPointCoords(i);
                 this.ctx.beginPath();
                 this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
                 // Highlight hovered point
                 if (i === this.hoveredIndex) {
                     this.ctx.save();
                     this.ctx.fillStyle = this.lightenColor(dataset.borderColor || this.getColor(datasetIndex), 50);
                     this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
                     this.ctx.fill();
                     this.ctx.restore();
                 } else {
                     this.ctx.fill();
                 }
            }
        });
        
        this.drawLegend(datasets);
    }
    
    drawPieChart() {
       // ... (this function is unchanged)
    }
    
    drawLegend(datasets) {
       // ... (this function is unchanged)
    }
    
    drawPieLegend(labels, colors) {
        // ... (this function is unchanged)
    }
    
    drawNoDataMessage() {
       // ... (this function is unchanged)
    }
    
    drawErrorMessage() {
        // ... (this function is unchanged)
    }
    
    getColor(index) {
        // ... (this function is unchanged)
    }
    
    lightenColor(color, percent) {
       // ... (this function is unchanged)
    }
    
    // --- MODIFIED to handle line chart hover detection ---
    handleMouseMove(x, y) {
        let needsRedraw = false;
        let foundHover = false;
    
        if (this.config.type === 'line') {
            this.pointCoordinates.forEach((coords, index) => {
                if (foundHover) return; // Only hover the first one found
                const distance = Math.sqrt(Math.pow(x - coords.x, 2) + Math.pow(y - coords.y, 2));
    
                if (distance < 8) { // 8px hover radius
                    if (this.hoveredIndex !== index) {
                        this.hoveredIndex = index;
                        needsRedraw = true;
                    }
                    foundHover = true;
                }
            });
    
            if (!foundHover && this.hoveredIndex !== -1) {
                this.hoveredIndex = -1;
                needsRedraw = true;
            }
        }
    
        if (needsRedraw) {
            this.redraw();
        }
    }
    
    handleClick(x, y) {
       // ... (this function is unchanged)
    }
    
    // --- NEW FUNCTION to draw the tooltip ---
    drawTooltip() {
        const pointData = this.config.data.datasets[0].data[this.hoveredIndex];
        if (!pointData || !this.pointCoordinates[this.hoveredIndex]) return;

        const ratingChange = pointData.newRating - pointData.oldRating;
        const sign = ratingChange >= 0 ? '+' : '';
        const changeColor = ratingChange > 0 ? 'lightgreen' : (ratingChange < 0 ? 'lightcoral' : 'white');

        const lines = [
            { text: pointData.contestName.substring(0, 40) + (pointData.contestName.length > 40 ? '...' : ''), font: 'bold 12px Arial', color: 'white'},
            { text: `Date: ${new Date(pointData.ratingUpdateTimeSeconds * 1000).toLocaleDateString()}`, font: '11px Arial', color: 'white' },
            { text: `Rank: ${pointData.rank}`, font: '11px Arial', color: 'white' },
            { text: `Rating: ${pointData.newRating} `, font: '11px Arial', color: 'white' },
            { text: `(${sign}${ratingChange})`, font: 'bold 11px Arial', color: changeColor }
        ];

        // Calculate tooltip size
        let tooltipWidth = 0;
        this.ctx.font = 'bold 12px Arial'; // For the widest line (title)
        tooltipWidth = this.ctx.measureText(lines[0].text).width;
        
        // Measure rating line width including the change part
        this.ctx.font = '11px Arial';
        let ratingLineWidth = this.ctx.measureText(lines[3].text).width;
        this.ctx.font = 'bold 11px Arial';
        ratingLineWidth += this.ctx.measureText(lines[4].text).width;
        tooltipWidth = Math.max(tooltipWidth, ratingLineWidth);


        const padding = 10;
        const lineHeight = 15;
        const tooltipHeight = lines.length * lineHeight - (lineHeight - 5) + padding * 2; // Compact the rating line
        tooltipWidth += padding * 2;

        // Tooltip position
        let tx = this.pointCoordinates[this.hoveredIndex].x - tooltipWidth / 2;
        let ty = this.pointCoordinates[this.hoveredIndex].y - tooltipHeight - 10; // 10px above the point

        // Adjust position to stay within canvas bounds
        if (tx < 0) tx = 5;
        if (tx + tooltipWidth > this.width) tx = this.width - tooltipWidth - 5;
        if (ty < 0) ty = this.pointCoordinates[this.hoveredIndex].y + 15;

        // Draw box
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 5;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(tx + 5, ty);
        this.ctx.lineTo(tx + tooltipWidth - 5, ty);
        this.ctx.quadraticCurveTo(tx + tooltipWidth, ty, tx + tooltipWidth, ty + 5);
        this.ctx.lineTo(tx + tooltipWidth, ty + tooltipHeight - 5);
        this.ctx.quadraticCurveTo(tx + tooltipWidth, ty + tooltipHeight, tx + tooltipWidth - 5, ty + tooltipHeight);
        this.ctx.lineTo(tx + 5, ty + tooltipHeight);
        this.ctx.quadraticCurveTo(tx, ty + tooltipHeight, tx, ty + tooltipHeight - 5);
        this.ctx.lineTo(tx, ty + 5);
        this.ctx.quadraticCurveTo(tx, ty, tx + 5, ty);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();

        // Draw text
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        let currentY = ty + padding + lineHeight/2;
        
        for (let i = 0; i < lines.length; i++) {
            if (i === 4) continue; // Skip the rating change line, it's drawn next to the rating

            this.ctx.font = lines[i].font;
            this.ctx.fillStyle = lines[i].color;
            this.ctx.fillText(lines[i].text, tx + padding, currentY);

            if (i === 3) { // After drawing "Rating: XXX"
                this.ctx.font = '11px Arial';
                const ratingTextWidth = this.ctx.measureText(lines[i].text).width;
                this.ctx.font = lines[i+1].font;
                this.ctx.fillStyle = lines[i+1].color;
                this.ctx.fillText(lines[i+1].text, tx + padding + ratingTextWidth, currentY);
            }

            if (i < lines.length - 2) { // don't add line height for the combined rating line
                 currentY += lineHeight;
            }
        }
    }
}

// Global Chart object to mimic Chart.js API
window.Chart = SimpleChart;