import React from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import { GlassCard } from './GlassCard'

const ProgressChart = ({ data = null, title = "Your Learning Progress", height = 300 }) => {
  // Generate realistic demo data if none provided
  const generateDemoData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    const visibleMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1)
    const values = visibleMonths.map((_, index) => Math.floor(Math.random() * 8) + (index * 2))
    
    return {
      categories: visibleMonths,
      values,
      total: values.reduce((a, b) => a + b, 0),
      trend: values[values.length - 1] > values[values.length - 2] ? 'up' : 'down'
    }
  }

  const chartData = data || generateDemoData()
  
  const chartOptions = {
    chart: {
      type: 'line',
      background: 'transparent',
      toolbar: { show: false },
      sparkline: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1200,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 4,
      lineCap: 'round'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.8,
        gradientToColors: ['#2DD4BF', '#3B82F6', '#8B5CF6'],
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.2,
        stops: [0, 50, 100],
        colorStops: [
          {
            offset: 0,
            color: '#2DD4BF',
            opacity: 0.9
          },
          {
            offset: 50,
            color: '#3B82F6',
            opacity: 0.6
          },
          {
            offset: 100,
            color: '#8B5CF6',
            opacity: 0.2
          }
        ]
      }
    },
    markers: {
      size: 6,
      colors: ['#2DD4BF'],
      strokeColors: '#1F2A44',
      strokeWidth: 3,
      hover: {
        size: 8,
        sizeOffset: 2
      }
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        show: true,
        stroke: {
          color: '#2DD4BF',
          width: 1,
          dashArray: 5
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '12px',
          fontWeight: 500
        },
        formatter: (val) => Math.floor(val)
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 4,
        xaxis: {
          lines: { show: true }
        }
      },
      min: 0,
      forceNiceScale: true
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 30,
        bottom: 0,
        left: 20
      },
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: true }
      }
    },
    tooltip: {
      theme: 'dark',
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex]
        const category = w.globals.categoryLabels[dataPointIndex]
        return `
          <div style="padding: 12px; background: rgba(31, 42, 68, 0.95); border: 1px solid rgba(45, 212, 191, 0.3); border-radius: 8px; color: white; font-size: 14px;">
            <div style="font-weight: 600; color: #2DD4BF; margin-bottom: 4px;">${category}</div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 8px; height: 8px; background: linear-gradient(45deg, #2DD4BF, #3B82F6); border-radius: 50%;"></div>
              <span>${value} credential${value !== 1 ? 's' : ''} earned</span>
            </div>
          </div>
        `
      }
    },
    colors: ['#2DD4BF'],
    dataLabels: {
      enabled: false
    }
  }

  const series = [{
    name: 'Skills Earned',
    data: chartData.values || [2, 4, 3, 6, 8, 12]
  }]

  const stats = [
    {
      label: 'Total Skills',
      value: chartData.total || 35
    },
    {
      label: 'This Month',
      value: chartData.values ? chartData.values[chartData.values.length - 1] : 12
    },
    {
      label: 'Streak',
      value: `${Math.floor(Math.random() * 15) + 5} days`
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full"
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-full sm:w-auto">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">{title}</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Track your skill development over time</p>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-sm sm:text-base lg:text-lg font-bold text-white leading-tight mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400 leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative w-full overflow-hidden"
        >
          <Chart
            options={chartOptions}
            series={series}
            type="area"
            height={typeof window !== 'undefined' && window.innerWidth < 640 ? 250 : height}
          />
          
          {/* Aurora effect overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: `linear-gradient(45deg, 
                rgba(45, 212, 191, 0.1) 0%, 
                rgba(59, 130, 246, 0.1) 50%, 
                rgba(139, 92, 246, 0.1) 100%)`,
              filter: 'blur(40px)',
              borderRadius: '12px'
            }}
          />
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mt-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 mb-2">
            <span className="text-xs sm:text-sm text-gray-400">Monthly Goal Progress</span>
            <span className="text-xs sm:text-sm font-semibold text-teal-500">
              {Math.min(100, Math.floor((chartData.values?.[chartData.values.length - 1] || 12) / 15 * 100))}%
            </span>
          </div>
          <div className="h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min(100, Math.floor((chartData.values?.[chartData.values.length - 1] || 12) / 15 * 100))}%` 
              }}
              transition={{ duration: 1.5, delay: 1 }}
              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProgressChart