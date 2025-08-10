import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  FaDownload, 
  FaQrcode, 
  FaShare, 
  FaCertificate, 
  FaEye,
  FaSpinner,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaEnvelope,
  FaCopy,
  FaImage
} from 'react-icons/fa'
import { GlassCard } from './GlassCard'
import { ThreeDBadge } from './ThreeDBadge'
import CertificateUtils from '../../utils/certificateUtils'
import SocialShare from '../../utils/socialShare'
import { AuroraToast } from './AuroraToast'

const CertificateCard = ({ 
  credential, 
  showActions = true, 
  size = 'default',
  onView,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const certificateRef = useRef(null)

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const generateQRCode = async () => {
    try {
      setIsGenerating(true)
      const qrDataUrl = await CertificateUtils.generateQRCode(credential.id)
      setQrCode(qrDataUrl)
      setShowQR(true)
      AuroraToast.success('QR code generated successfully!')
    } catch (error) {
      console.error('QR generation error:', error)
      AuroraToast.error('Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDF = async () => {
    try {
      setIsGenerating(true)
      
      const certificateData = {
        id: credential.id || credential.blockchain_id,
        skill: credential.skill,
        recipientName: credential.recipient_name || 'Verified Professional',
        timestamp: credential.timestamp || credential.created_at,
        issuerAddress: credential.issuer || credential.issuer_address,
        metadata: credential.metadata
      }

      const pdfBlob = await CertificateUtils.generateCertificatePDF(certificateData)
      const filename = `skillcert-${credential.skill.replace(/\s+/g, '-').toLowerCase()}-${certificateData.id}.pdf`
      
      CertificateUtils.downloadBlob(pdfBlob, filename)
      AuroraToast.success('Certificate downloaded successfully!')
    } catch (error) {
      console.error('PDF generation error:', error)
      AuroraToast.error('Failed to generate certificate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async () => {
    try {
      setIsGenerating(true)
      
      const certificateData = {
        id: credential.id || credential.blockchain_id,
        skill: credential.skill,
        recipientName: credential.recipient_name || 'Verified Professional',
        timestamp: credential.timestamp || credential.created_at
      }

      const imageDataUrl = await CertificateUtils.generateCertificateImage(certificateData, {
        includeQR: true
      })
      
      // Convert data URL to blob and download
      const response = await fetch(imageDataUrl)
      const blob = await response.blob()
      const filename = `skillcert-${credential.skill.replace(/\s+/g, '-').toLowerCase()}-${certificateData.id}.png`
      
      CertificateUtils.downloadBlob(blob, filename)
      AuroraToast.success('Certificate image downloaded!')
    } catch (error) {
      console.error('Image generation error:', error)
      AuroraToast.error('Failed to generate certificate image')
    } finally {
      setIsGenerating(false)
    }
  }

  const shareCredential = async () => {
    // Try native sharing first
    const nativeShareSuccess = await SocialShare.shareNative(credential)
    
    if (!nativeShareSuccess) {
      // Show share menu for desktop/unsupported devices
      setShowShareMenu(true)
    }
  }

  const copyVerificationLink = async () => {
    const success = await SocialShare.copyVerificationLink(credential)
    if (success) {
      AuroraToast.success('Verification link copied to clipboard!')
      setShowShareMenu(false)
    } else {
      AuroraToast.error('Failed to copy link')
    }
  }

  const shareOnPlatform = (platform) => {
    try {
      switch (platform) {
        case 'linkedin':
          SocialShare.shareOnLinkedIn(credential)
          break
        case 'twitter':
          SocialShare.shareOnTwitter(credential)
          break
        case 'facebook':
          SocialShare.shareOnFacebook(credential)
          break
        case 'email':
          SocialShare.shareViaEmail(credential)
          break
        default:
          console.error('Unsupported platform:', platform)
      }
      setShowShareMenu(false)
    } catch (error) {
      console.error('Share platform error:', error)
      AuroraToast.error('Failed to share on platform')
    }
  }

  const openVerification = () => {
    const verifyUrl = `${window.location.origin}/verify/${credential.id || credential.blockchain_id}`
    window.open(verifyUrl, '_blank')
  }

  const sizeClasses = {
    small: 'p-3 sm:p-4',
    default: 'p-4 sm:p-6',
    large: 'p-6 sm:p-8'
  }

  return (
    <>
      <motion.div
        ref={certificateRef}
        className={`${className} relative`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className={`${sizeClasses[size]} relative overflow-hidden w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl`}>
          {/* Certificate header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <ThreeDBadge 
                skill={credential.skill}
                size="small"
                verified={true}
                color="#2DD4BF"
              />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gradient truncate">
                  {credential.skill} Certification
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 font-mono break-all">
                  ID: {credential.id || credential.blockchain_id}
                </p>
              </div>
            </div>
            
            {credential.is_verified !== false && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap"
              >
                <FaCheckCircle />
                Verified
              </motion.div>
            )}
          </div>

          {/* Certificate details */}
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Issued:</span>
              <span className="text-white font-medium">
                {formatDate(credential.timestamp || credential.created_at)}
              </span>
            </div>
            
            {credential.issuer && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Issuer:</span>
                <span className="text-white font-mono text-xs">
                  {credential.issuer.substring(0, 10)}...{credential.issuer.substring(-8)}
                </span>
              </div>
            )}

            {credential.ipfs_hash && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">IPFS:</span>
                <span className="text-teal-400 font-mono text-xs">
                  {credential.ipfs_hash.substring(0, 12)}...
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              <motion.button
                className="btn-secondary flex items-center gap-2 text-sm px-3 py-2"
                onClick={() => onView && onView(credential)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaEye />
                View
              </motion.button>

              <motion.button
                className="btn-secondary flex items-center gap-2 text-sm px-3 py-2"
                onClick={generateQRCode}
                disabled={isGenerating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? <FaSpinner className="animate-spin" /> : <FaQrcode />}
                QR Code
              </motion.button>

              <motion.button
                className="btn-secondary flex items-center gap-2 text-sm px-3 py-2"
                onClick={downloadPDF}
                disabled={isGenerating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                PDF
              </motion.button>

              <motion.button
                className="btn-secondary flex items-center gap-2 text-sm px-3 py-2"
                onClick={shareCredential}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaShare />
                Share
              </motion.button>

              <motion.button
                className="btn-secondary flex items-center gap-2 text-sm px-3 py-2"
                onClick={openVerification}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaExternalLinkAlt />
                Verify
              </motion.button>
            </div>
          )}

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16" />
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12" />
        </div>
      </motion.div>

      {/* QR Code Modal */}
      {showQR && qrCode && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowQR(false)}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Verification QR Code
            </h3>
            <div className="bg-white p-4 rounded-xl shadow-inner mb-4">
              <img 
                src={qrCode} 
                alt="Verification QR Code"
                className="w-full h-auto max-w-64 mx-auto"
              />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Scan this QR code to verify the credential online
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                onClick={() => {
                  const link = document.createElement('a')
                  link.download = `qr-code-${credential.id}.png`
                  link.href = qrCode
                  link.click()
                }}
              >
                Download QR
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => setShowQR(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Share Menu Modal */}
      {showShareMenu && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowShareMenu(false)}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full border border-teal-500/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Share Your Achievement
            </h3>
            <p className="text-gray-400 text-center mb-6">
              Show the world your verified {credential.skill} skills!
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* LinkedIn */}
              <motion.button
                className="flex items-center gap-3 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => shareOnPlatform('linkedin')}
              >
                <FaLinkedin className="text-blue-400 text-xl" />
                <span className="text-white font-medium">LinkedIn</span>
              </motion.button>

              {/* Twitter */}
              <motion.button
                className="flex items-center gap-3 p-3 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => shareOnPlatform('twitter')}
              >
                <FaTwitter className="text-sky-400 text-xl" />
                <span className="text-white font-medium">Twitter</span>
              </motion.button>

              {/* Facebook */}
              <motion.button
                className="flex items-center gap-3 p-3 bg-blue-700/20 hover:bg-blue-700/30 border border-blue-600/30 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => shareOnPlatform('facebook')}
              >
                <FaFacebook className="text-blue-500 text-xl" />
                <span className="text-white font-medium">Facebook</span>
              </motion.button>

              {/* Email */}
              <motion.button
                className="flex items-center gap-3 p-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => shareOnPlatform('email')}
              >
                <FaEnvelope className="text-green-400 text-xl" />
                <span className="text-white font-medium">Email</span>
              </motion.button>
            </div>

            <div className="space-y-3">
              {/* Copy Link */}
              <motion.button
                className="w-full flex items-center justify-center gap-3 p-3 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyVerificationLink}
              >
                <FaCopy className="text-teal-400" />
                <span className="text-white font-medium">Copy Verification Link</span>
              </motion.button>

              {/* Download Social Image */}
              <motion.button
                className="w-full flex items-center justify-center gap-3 p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadImage}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <FaSpinner className="text-purple-400 animate-spin" />
                ) : (
                  <FaImage className="text-purple-400" />
                )}
                <span className="text-white font-medium">Download Social Image</span>
              </motion.button>

              {/* Close button */}
              <motion.button
                className="w-full p-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-xl transition-colors text-gray-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowShareMenu(false)}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default CertificateCard