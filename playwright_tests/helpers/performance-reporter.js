/**
 * Performance Reporter for Playwright Tests
 * Captures execution times and generates comparison reports with pytest results
 */

const fs = require('fs');
const path = require('path');

class PerformanceReporter {
  constructor() {
    this.testResults = [];
    this.suiteStartTime = null;
    this.suiteEndTime = null;
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.skippedTests = 0;
  }

  onBegin(config, suite) {
    this.suiteStartTime = Date.now();
    console.log('🚀 Starting Playwright test suite execution...');
  }

  onTestBegin(test) {
    test._startTime = Date.now();
  }

  onTestEnd(test, result) {
    const endTime = Date.now();
    const duration = endTime - test._startTime;

    this.totalTests++;
    
    switch (result.status) {
      case 'passed':
        this.passedTests++;
        break;
      case 'failed':
        this.failedTests++;
        break;
      case 'skipped':
      case 'timedOut':
        this.skippedTests++;
        break;
    }

    const testResult = {
      title: test.title,
      fullTitle: test.titlePath().join(' > '),
      file: path.relative(process.cwd(), test.location.file),
      duration: duration,
      status: result.status,
      error: result.error ? result.error.message : null,
      retries: result.retry,
      startTime: test._startTime,
      endTime: endTime
    };

    this.testResults.push(testResult);

    const statusIcon = result.status === 'passed' ? '✅' : 
                       result.status === 'failed' ? '❌' : '⏭️';
    console.log(`${statusIcon} ${testResult.fullTitle} (${duration}ms)`);
  }

  onEnd(result) {
    this.suiteEndTime = Date.now();
    const totalDuration = this.suiteEndTime - this.suiteStartTime;

    console.log('\n📊 Test Execution Summary:');
    console.log(`   Total: ${this.totalTests}`);
    console.log(`   Passed: ${this.passedTests} ✅`);
    console.log(`   Failed: ${this.failedTests} ❌`);
    console.log(`   Skipped: ${this.skippedTests} ⏭️`);
    console.log(`   Duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);

    // Save JSON results
    this.saveResults(totalDuration);
    
    // Generate HTML report
    this.generateHTMLReport(totalDuration);
  }

  saveResults(totalDuration) {
    const reportData = {
      framework: 'Playwright',
      timestamp: new Date().toISOString(),
      totalDuration: totalDuration,
      totalTests: this.totalTests,
      passed: this.passedTests,
      failed: this.failedTests,
      skipped: this.skippedTests,
      tests: this.testResults
    };

    const reportPath = path.join(process.cwd(), 'reports', 'playwright-results.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n💾 Results saved to: ${reportPath}`);
  }

  generateHTMLReport(totalDuration) {
    const htmlContent = this.createHTMLReport(totalDuration);
    const reportPath = path.join(process.cwd(), 'reports', 'performance-comparison.html');
    fs.writeFileSync(reportPath, htmlContent);
    console.log(`📄 HTML Report generated: ${reportPath}`);
  }

  createHTMLReport(totalDuration) {
    const avgDuration = this.totalTests > 0 ? (totalDuration / this.totalTests).toFixed(2) : 0;
    
    // Try to load pytest results if they exist
    const pytestPath = path.join(process.cwd(), '..', 'test_results', 'pytest-results.json');
    let pytestData = null;
    let comparisonSection = '';

    if (fs.existsSync(pytestPath)) {
      try {
        pytestData = JSON.parse(fs.readFileSync(pytestPath, 'utf-8'));
        comparisonSection = this.createComparisonSection(pytestData, totalDuration);
      } catch (e) {
        console.log('⚠️  Could not load pytest results for comparison');
      }
    } else {
      comparisonSection = `
        <div class="comparison-placeholder">
          <h2>⏳ Pytest Comparison Pending</h2>
          <p>To compare with pytest results, run:</p>
          <pre>cd /workspaces && python run_tests.py --json-report</pre>
          <p>Then re-run the Playwright tests to generate the comparison.</p>
        </div>
      `;
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Comparison Report - Playwright vs Pytest</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .header .timestamp {
            margin-top: 15px;
            font-size: 0.9em;
            opacity: 0.7;
        }
        
        .content {
            padding: 40px;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%);
            border-radius: 15px;
            padding: 25px;
            border: 2px solid #e2e8f0;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .metric-card .label {
            font-size: 0.9em;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        
        .metric-card .value {
            font-size: 2.5em;
            font-weight: 700;
            color: #2d3748;
            line-height: 1;
        }
        
        .metric-card .unit {
            font-size: 0.5em;
            color: #94a3b8;
            font-weight: 400;
        }
        
        .metric-card.passed { border-left: 5px solid #10b981; }
        .metric-card.failed { border-left: 5px solid #ef4444; }
        .metric-card.skipped { border-left: 5px solid #f59e0b; }
        .metric-card.duration { border-left: 5px solid #3b82f6; }
        
        .metric-card.passed .value { color: #10b981; }
        .metric-card.failed .value { color: #ef4444; }
        .metric-card.skipped .value { color: #f59e0b; }
        .metric-card.duration .value { color: #3b82f6; }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h2 {
            font-size: 1.8em;
            color: #2d3748;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        
        .comparison-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .framework-card {
            background: #f8fafc;
            border-radius: 15px;
            padding: 30px;
            border: 2px solid #e2e8f0;
        }
        
        .framework-card h3 {
            font-size: 1.5em;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .framework-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3em;
        }
        
        .playwright-icon {
            background: linear-gradient(135deg, #2d9c68 0%, #1e7a4d 100%);
        }
        
        .pytest-icon {
            background: linear-gradient(135deg, #0a9edc 0%, #0667a1 100%);
        }
        
        .stat-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .stat-row:last-child {
            border-bottom: none;
        }
        
        .stat-label {
            color: #64748b;
            font-weight: 500;
        }
        
        .stat-value {
            font-weight: 700;
            color: #2d3748;
        }
        
        .winner-badge {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 700;
            margin-left: 10px;
        }
        
        .test-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        
        .test-table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .test-table th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 1px;
        }
        
        .test-table td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .test-table tbody tr:hover {
            background: #f8fafc;
        }
        
        .test-table tbody tr:last-child td {
            border-bottom: none;
        }
        
        .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }
        
        .status-passed {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status-failed {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .status-skipped {
            background: #fef3c7;
            color: #92400e;
        }
        
        .duration-cell {
            font-family: 'Courier New', monospace;
            font-weight: 600;
            color: #3b82f6;
        }
        
        .comparison-placeholder {
            background: #fef3c7;
            border: 2px dashed #f59e0b;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
        }
        
        .comparison-placeholder h2 {
            color: #92400e;
            border: none;
            margin-bottom: 15px;
        }
        
        .comparison-placeholder pre {
            background: #fffbeb;
            padding: 15px;
            border-radius: 8px;
            display: inline-block;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            color: #92400e;
            border: 1px solid #fbbf24;
        }
        
        .chart-container {
            background: #f8fafc;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            border: 2px solid #e2e8f0;
        }
        
        .bar-chart {
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            height: 300px;
            margin-top: 20px;
        }
        
        .bar {
            width: 100px;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px 10px 0 0;
            position: relative;
            transition: transform 0.3s;
        }
        
        .bar:hover {
            transform: scaleY(1.05);
        }
        
        .bar-label {
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-weight: 600;
            font-size: 0.9em;
            white-space: nowrap;
        }
        
        .bar-value {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-weight: 700;
            font-size: 1.1em;
            color: #2d3748;
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            color: #64748b;
            border-top: 2px solid #e2e8f0;
        }
        
        @media (max-width: 768px) {
            .comparison-grid {
                grid-template-columns: 1fr;
            }
            
            .metrics-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 Performance Comparison Report</h1>
            <div class="subtitle">Playwright vs Pytest Test Execution Analysis</div>
            <div class="timestamp">Generated: ${new Date().toLocaleString()}</div>
        </div>
        
        <div class="content">
            <!-- Playwright Metrics -->
            <div class="section">
                <h2>Playwright Test Results</h2>
                <div class="metrics-grid">
                    <div class="metric-card duration">
                        <div class="label">Total Duration</div>
                        <div class="value">${(totalDuration / 1000).toFixed(2)} <span class="unit">seconds</span></div>
                    </div>
                    <div class="metric-card passed">
                        <div class="label">Passed</div>
                        <div class="value">${this.passedTests}</div>
                    </div>
                    <div class="metric-card failed">
                        <div class="label">Failed</div>
                        <div class="value">${this.failedTests}</div>
                    </div>
                    <div class="metric-card skipped">
                        <div class="label">Skipped</div>
                        <div class="value">${this.skippedTests}</div>
                    </div>
                </div>
            </div>
            
            ${comparisonSection}
            
            <!-- Detailed Test Results -->
            <div class="section">
                <h2>Detailed Test Results</h2>
                <table class="test-table">
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            <th>File</th>
                            <th>Status</th>
                            <th>Duration (ms)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.testResults.map(test => `
                            <tr>
                                <td>${test.title}</td>
                                <td><code>${test.file}</code></td>
                                <td><span class="status-badge status-${test.status}">${test.status.toUpperCase()}</span></td>
                                <td class="duration-cell">${test.duration}ms</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Performance Metrics -->
            <div class="section">
                <h2>Performance Metrics</h2>
                <div class="chart-container">
                    <h3>Average Test Duration</h3>
                    <div class="bar-chart">
                        <div class="bar" style="height: ${Math.min((avgDuration / 5) * 100, 100)}%;">
                            <div class="bar-value">${avgDuration}ms</div>
                            <div class="bar-label">Playwright</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>E2E Communication Platform</strong> - Automated Test Performance Analysis</p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  createComparisonSection(pytestData, playwrightDuration) {
    const pytestDuration = pytestData.totalDuration || 0;
    const playwrightFaster = pytestDuration > playwrightDuration;
    const diff = Math.abs(pytestDuration - playwrightDuration);
    const percentDiff = ((diff / Math.max(pytestDuration, playwrightDuration)) * 100).toFixed(2);
    
    return `
      <div class="section">
        <h2>Framework Comparison</h2>
        <div class="comparison-grid">
          <div class="framework-card">
            <h3>
              <div class="framework-icon playwright-icon">🎭</div>
              Playwright
              ${playwrightFaster ? '<span class="winner-badge">⚡ FASTER</span>' : ''}
            </h3>
            <div class="stat-row">
              <span class="stat-label">Total Duration</span>
              <span class="stat-value">${(playwrightDuration / 1000).toFixed(2)}s</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Total Tests</span>
              <span class="stat-value">${this.totalTests}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Passed</span>
              <span class="stat-value">${this.passedTests}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Failed</span>
              <span class="stat-value">${this.failedTests}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Avg per Test</span>
              <span class="stat-value">${(playwrightDuration / this.totalTests).toFixed(2)}ms</span>
            </div>
          </div>
          
          <div class="framework-card">
            <h3>
              <div class="framework-icon pytest-icon">🐍</div>
              Pytest
              ${!playwrightFaster ? '<span class="winner-badge">⚡ FASTER</span>' : ''}
            </h3>
            <div class="stat-row">
              <span class="stat-label">Total Duration</span>
              <span class="stat-value">${(pytestDuration / 1000).toFixed(2)}s</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Total Tests</span>
              <span class="stat-value">${pytestData.totalTests || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Passed</span>
              <span class="stat-value">${pytestData.passed || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Failed</span>
              <span class="stat-value">${pytestData.failed || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Avg per Test</span>
              <span class="stat-value">${((pytestDuration / (pytestData.totalTests || 1))).toFixed(2)}ms</span>
            </div>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Execution Time Comparison</h3>
          <p style="text-align: center; color: #64748b; margin-bottom: 20px;">
            ${playwrightFaster ? 'Playwright' : 'Pytest'} is <strong>${percentDiff}%</strong> faster (${(diff / 1000).toFixed(2)}s difference)
          </p>
          <div class="bar-chart">
            <div class="bar" style="height: ${playwrightFaster ? '60%' : '100%'}; background: linear-gradient(180deg, #2d9c68 0%, #1e7a4d 100%);">
              <div class="bar-value">${(playwrightDuration / 1000).toFixed(2)}s</div>
              <div class="bar-label">Playwright</div>
            </div>
            <div class="bar" style="height: ${!playwrightFaster ? '60%' : '100%'}; background: linear-gradient(180deg, #0a9edc 0%, #0667a1 100%);">
              <div class="bar-value">${(pytestDuration / 1000).toFixed(2)}s</div>
              <div class="bar-label">Pytest</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

module.exports = PerformanceReporter;
