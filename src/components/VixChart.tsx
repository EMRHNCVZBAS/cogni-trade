import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface VixData {
  timestamp: number
  value: number
}

interface VixChartProps {
  data: VixData[]
}

export default function VixChart({ data }: VixChartProps) {
  const chartData = {
    labels: data.map(item => new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })),
    datasets: [
      {
        label: 'Fear Index (VIX)',
        data: data.map(item => item.value),
        fill: true,
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(234, 179, 8)',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      }
    ]
  }

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value: any) {
            return value.toFixed(2)
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgb(234, 179, 8)',
        bodyColor: '#fff',
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `VIX: ${context.parsed.y.toFixed(2)}`
          }
        }
      }
    }
  }

  return (
    <div className="relative h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  )
} 