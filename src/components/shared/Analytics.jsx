import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie,
  FaArrowUp,
  FaTrophy,
  FaCalendar,
  FaDownload,
  FaSpinner
} from 'react-icons/fa'
import { GlassCard } from './GlassCard'
import backendService from '../../api/backend'
import { AuroraToast } from './AuroraToast'

const Analytics = ({ userId, className = '' }) => {
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [timeframe, setTimeframe] = useState('6months')
  const [selectedMetric, setSelectedMetric] = useState('skills')

  useEffect(() => {
    loadAnalytics()
  }, [timeframe, userId])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // Mock analytics data - in real implementation, this would come from backend
      const mockData = generateMockAnalytics(timeframe)
      setAnalyticsData(mockData)
      
      // Uncomment when backend analytics endpoint is available
      // const result = await backendService.getUserAnalytics(userId, timeframe)
      // if (result.success) {
      //   setAnalyticsData(result.analytics)
      // }
    } catch (error) {
      console.error('Analytics load error:', error)
      AuroraToast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const generateMockAnalytics = (timeframe) => {
    const periods = {
      '30days': 30,
      '90days': 90,
      '6months': 180,
      '1year': 365
    }
    
    const days = periods[timeframe] || 180
    const categories = []
    const skillsData = []
    const credentialsData = []
    const verificationData = []
    
    for (let i = days; i >= 0; i -= Math.floor(days / 12)) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      categories.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      
      skillsData.push(Math.floor(Math.random() * 5) + 1)
      credentialsData.push(Math.floor(Math.random() * 3) + 1)
      verificationData.push(Math.floor(Math.random() * 20) + 5)
    }

    return {
      summary: {
        totalSkills: 24,
        totalCredentials: 18,
        totalVerifications: 156,
        averageScore: 87,
        growthRate: 23.5,
        completionRate: 94.2
      },
      timeSeries: {
        categories,
        skillsEarned: skillsData,
        credentialsIssued: credentialsData,
        verifications: verificationData
      },
      skillsBreakdown: [
        { skill: 'React Development', count: 8, percentage: 33.3 },
        { skill: 'Python Programming', count: 6, percentage: 25.0 },
        { skill: 'UI/UX Design', count: 4, percentage: 16.7 },
        { skill: 'Machine Learning', count: 3, percentage: 12.5 },
        { skill: 'DevOps', count: 2, percentage: 8.3 },
        { skill: 'Blockchain', count: 1, percentage: 4.2 }
      ],
      monthlyGoals: {
        target: 15,
        achieved: 12,
        percentage: 80
      },
      credentialStatus: {
        verified: 18,
        pending: 2,
        expired: 0
      }
    }
  }

  const exportAnalytics = async (format = 'json') => {
    try {
      if (!analyticsData) return

      let exportData
      let filename
      let mimeType

      switch (format) {
        case 'json':
          exportData = JSON.stringify(analyticsData, null, 2)
          filename = `skillcert-analytics-${new Date().toISOString().split('T')[0]}.json`
          mimeType = 'application/json'
          break
        case 'csv':
          exportData = convertToCSV(analyticsData)
          filename = `skillcert-analytics-${new Date().toISOString().split('T')[0]}.csv`
          mimeType = 'text/csv'
          break
        default:
          throw new Error('Unsupported format')
      }

      const blob = new Blob([exportData], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      AuroraToast.success(`Analytics exported as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Export error:', error)
      AuroraToast.error('Failed to export analytics data')
    }
  }

  const convertToCSV = (data) => {
    const { timeSeries, skillsBreakdown, summary } = data
    
    let csv = 'Analytics Report\n\n'
    
    // Summary section
    csv += 'Summary\n'
    csv += 'Metric,Value\n'
    Object.entries(summary).forEach(([key, value]) => {
      csv += `${key},${value}\n`
    })
    
    csv += '\nTime Series Data\n'
    csv += 'Date,Skills Earned,Credentials Issued,Verifications\n'
    timeSeries.categories.forEach((date, index) => {
      csv += `${date},${timeSeries.skillsEarned[index]},${timeSeries.credentialsIssued[index]},${timeSeries.verifications[index]}\n`
    })
    
    csv += '\nSkills Breakdown\n'
    csv += 'Skill,Count,Percentage\n'
    skillsBreakdown.forEach(skill => {
      csv += `${skill.skill},${skill.count},${skill.percentage}%\n`
    })
    
    return csv
  }

  const getChartOptions = (type, data) => {
    const baseOptions = {
      chart: {
        background: 'transparent',
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      theme: {
        mode: 'dark'
      },
      colors: ['#2DD4BF', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'],
      tooltip: {
        theme: 'dark',
        style: {
          background: 'rgba(31, 42, 68, 0.95)'
        }
      }
    }

    switch (type) {
      case 'line':
        return {
          ...baseOptions,
          chart: {
            ...baseOptions.chart,
            type: 'line'
          },
          stroke: {
            curve: 'smooth',
            width: 3
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 0.8,
              opacityFrom: 0.7,
              opacityTo: 0.1
            }
          },
          xaxis: {
            categories: data.categories,
            labels: { style: { colors: '#9CA3AF' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
          },
          yaxis: {
            labels: { style: { colors: '#9CA3AF' } },
            grid: { borderColor: '#374151' }
          },
          grid: {
            borderColor: '#374151',
            strokeDashArray: 4
          }
        }

      case 'donut':
        return {
          ...baseOptions,
          chart: {
            ...baseOptions.chart,
            type: 'donut'
          },
          plotOptions: {
            pie: {
              donut: {
                size: '70%'
              }
            }
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            labels: {
              colors: '#9CA3AF'
            },
            markers: {
              width: 12,
              height: 12
            }
          }
        }

      case 'bar':
        return {
          ...baseOptions,
          chart: {
            ...baseOptions.chart,
            type: 'bar'
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: true
            }
          },
          xaxis: {
            categories: data.map(item => item.skill),
            labels: { style: { colors: '#9CA3AF' } }
          },
          yaxis: {
            labels: { style: { colors: '#9CA3AF' } }
          },
          grid: {
            borderColor: '#374151'
          }
        }

      default:
        return baseOptions
    }
  }

  if (loading) {
    return (
      <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-3">
          <FaSpinner className="text-2xl text-teal-500 animate-spin" />
          <span className="text-white">Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl text-center ${className}`}>
        <div className="text-gray-400">
          <FaChartBar className="text-4xl mx-auto mb-4 opacity-50" />
          <p>No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">Analytics Dashboard</h2>
          <p className="text-gray-400">Track your learning progress and achievements</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-teal-500 w-full sm:w-auto"
          >
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last year</option>
          </select>
          
          <div className="relative">
            <button
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 border border-gray-600/30 hover:border-teal-500/50 w-full sm:w-auto justify-center"
              onClick={() => exportAnalytics('json')}
            >
              <FaDownload />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl text-center">
            <FaTrophy className="text-2xl text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{analyticsData.summary.totalSkills}</div>
            <div className="text-sm text-gray-400">Skills Mastered</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl text-center">
            <FaChartLine className="text-2xl text-teal-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{analyticsData.summary.totalCredentials}</div>
            <div className="text-sm text-gray-400">Credentials Earned</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl text-center">
            <FaArrowUp className="text-2xl text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{analyticsData.summary.growthRate}%</div>
            <div className="text-sm text-gray-400">Growth Rate</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl text-center">
            <FaCalendar className="text-2xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{analyticsData.summary.averageScore}%</div>
            <div className="text-sm text-gray-400">Avg. Score</div>
          </div>
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Over Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Progress Over Time</h3>
            <Chart
              options={getChartOptions('line', analyticsData.timeSeries)}
              series={[
                { name: 'Skills Earned', data: analyticsData.timeSeries.skillsEarned },
                { name: 'Verifications', data: analyticsData.timeSeries.verifications.map(v => Math.floor(v / 10)) }
              ]}
              type="area"
              height={300}
            />
          </div>
        </motion.div>

        {/* Skills Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Skills Distribution</h3>
            <Chart
              options={getChartOptions('donut')}
              series={analyticsData.skillsBreakdown.map(skill => skill.count)}
              labels={analyticsData.skillsBreakdown.map(skill => skill.skill)}
              type="donut"
              height={300}
            />
          </div>
        </motion.div>
      </div>

      {/* Skills Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Detailed Skills Breakdown</h3>
          <Chart
            options={getChartOptions('bar', analyticsData.skillsBreakdown)}
            series={[{ name: 'Credentials', data: analyticsData.skillsBreakdown.map(skill => skill.count) }]}
            type="bar"
            height={250}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics