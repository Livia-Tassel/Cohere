import { motion } from 'framer-motion';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ActivityChart = ({ data }) => {
  const chartData = {
    labels: data.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Questions',
        data: data.questions || [12, 19, 3, 5, 2, 3, 9],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Answers',
        data: data.answers || [7, 11, 5, 8, 3, 7, 4],
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
        Weekly Activity
      </h3>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

const ReputationChart = ({ data }) => {
  const chartData = {
    labels: data.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Reputation',
        data: data.values || [100, 250, 400, 650],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(236, 72, 153)',
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)'
        ],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
        Reputation Growth
      </h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

const TagDistribution = ({ data }) => {
  const chartData = {
    labels: data.labels || ['JavaScript', 'Python', 'React', 'Node.js', 'CSS'],
    datasets: [
      {
        data: data.values || [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(236, 72, 153)',
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
        Tag Distribution
      </h3>
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

const SkillRadar = ({ data }) => {
  const chartData = {
    labels: data.labels || ['Frontend', 'Backend', 'Database', 'DevOps', 'Testing'],
    datasets: [
      {
        label: 'Skill Level',
        data: data.values || [85, 70, 60, 55, 75],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
        Skill Assessment
      </h3>
      <div className="h-64">
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, change, color = 'primary' }) => {
  const colors = {
    primary: 'text-[var(--color-primary)]',
    secondary: 'text-[var(--color-secondary)]',
    success: 'text-[var(--color-success)]',
    warning: 'text-[var(--color-warning)]',
    error: 'text-[var(--color-error)]'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {change && (
          <span className={`text-xs font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className={`text-3xl font-bold ${colors[color]} mb-1`}>
        {value}
      </div>
      <div className="text-sm text-[var(--text-secondary)]">
        {label}
      </div>
    </motion.div>
  );
};

export { ActivityChart, ReputationChart, TagDistribution, SkillRadar, StatCard };
