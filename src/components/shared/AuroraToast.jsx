import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimes,
  FaEthereum,
  FaCertificate
} from 'react-icons/fa'
import { cn } from '../../lib/utils'

const ToastContent = ({ type, message, title, icon: CustomIcon }) => {
  const icons = {
    success: FaCheckCircle,
    error: FaTimes,
    warning: FaExclamationTriangle,
    info: FaInfoCircle,
    credential: FaCertificate,
    blockchain: FaEthereum
  }

  const Icon = CustomIcon || icons[type] || FaInfoCircle

  const typeStyles = {
    success: 'from-skill-green to-skill-teal',
    error: 'from-red-500 to-orange-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-skill-blue to-skill-teal',
    credential: 'from-skill-teal to-skill-purple',
    blockchain: 'from-skill-blue to-skill-purple'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={cn(
        "flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r backdrop-blur-sm border border-white/20",
        typeStyles[type] || typeStyles.info
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex-shrink-0"
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold text-white mb-1">{title}</h4>
        )}
        <p className="text-white/90 text-sm">{message}</p>
      </div>
    </motion.div>
  )
}

// Custom toast functions with aurora styling
export const AuroraToast = {
  success: (message, options = {}) => {
    return toast.success(
      <ToastContent 
        type="success" 
        message={message} 
        title={options.title}
        icon={options.icon}
      />,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "aurora-toast",
        bodyClassName: "aurora-toast-body",
        ...options
      }
    )
  },

  error: (message, options = {}) => {
    return toast.error(
      <ToastContent 
        type="error" 
        message={message} 
        title={options.title}
        icon={options.icon}
      />,
      {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "aurora-toast",
        bodyClassName: "aurora-toast-body",
        ...options
      }
    )
  },

  info: (message, options = {}) => {
    return toast.info(
      <ToastContent 
        type="info" 
        message={message} 
        title={options.title}
        icon={options.icon}
      />,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "aurora-toast",
        bodyClassName: "aurora-toast-body",
        ...options
      }
    )
  },

  warning: (message, options = {}) => {
    return toast.warning(
      <ToastContent 
        type="warning" 
        message={message} 
        title={options.title}
        icon={options.icon}
      />,
      {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "aurora-toast",
        bodyClassName: "aurora-toast-body",
        ...options
      }
    )
  },

  credential: (message, options = {}) => {
    return toast.success(
      <ToastContent 
        type="credential" 
        message={message} 
        title={options.title || "Credential Earned!"}
        icon={options.icon}
      />,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "aurora-toast credential-toast",
        bodyClassName: "aurora-toast-body",
        ...options
      }
    )
  },

  blockchain: (message, options = {}) => {
    return toast.info(
      <ToastContent 
        type="blockchain" 
        message={message} 
        title={options.title || "Blockchain Transaction"}
        icon={options.icon}
      />,
      {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "aurora-toast blockchain-toast",
        bodyClassName: "aurora-toast-body",
        ...options
      }
    )
  }
}