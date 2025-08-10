import QRCode from 'qrcode'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Certificate utility functions for QR code generation and PDF creation
 */
class CertificateUtils {
  /**
   * Generate QR code for credential verification
   * @param {string} credentialId - The credential ID or verification URL
   * @param {Object} options - QR code options
   * @returns {Promise<string>} Base64 QR code image
   */
  static async generateQRCode(credentialId, options = {}) {
    try {
      const verificationUrl = `${window.location.origin}/verify/${credentialId}`
      
      const qrOptions = {
        width: options.width || 200,
        height: options.height || 200,
        color: {
          dark: options.darkColor || '#2DD4BF',
          light: options.lightColor || '#FFFFFF'
        },
        errorCorrectionLevel: options.errorLevel || 'M',
        margin: options.margin || 2,
        ...options
      }

      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, qrOptions)
      return qrCodeDataUrl
    } catch (error) {
      console.error('QR Code generation error:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  /**
   * Generate certificate as PDF
   * @param {Object} credentialData - Credential information
   * @param {Object} options - PDF options
   * @returns {Promise<Blob>} PDF blob
   */
  static async generateCertificatePDF(credentialData, options = {}) {
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Generate QR code for verification
      const qrCode = await this.generateQRCode(credentialData.id, {
        width: 150,
        height: 150
      })

      // Colors
      const primaryColor = [45, 212, 191] // Teal
      const secondaryColor = [59, 130, 246] // Blue
      const darkColor = [31, 42, 68] // Dark gray
      const textColor = [255, 255, 255] // White

      // Background gradient effect
      pdf.setFillColor(...darkColor)
      pdf.rect(0, 0, 297, 210, 'F')

      // Header section with gradient-like effect
      pdf.setFillColor(...primaryColor)
      pdf.rect(0, 0, 297, 60, 'F')
      pdf.setFillColor(45, 212, 191, 0.8)
      pdf.rect(0, 30, 297, 30, 'F')

      // Certificate title
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(36)
      pdf.setTextColor(...textColor)
      pdf.text('BLOCKCHAIN CERTIFICATE', 148.5, 25, { align: 'center' })
      
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Verified on SkillCert Platform', 148.5, 45, { align: 'center' })

      // Main content area
      pdf.setFillColor(255, 255, 255, 0.05)
      pdf.rect(20, 80, 257, 100, 'F')

      // Skill certification text
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('This certifies that', 148.5, 100, { align: 'center' })

      pdf.setFontSize(32)
      pdf.setTextColor(...primaryColor)
      pdf.text(credentialData.recipientName || 'Certified Individual', 148.5, 115, { align: 'center' })

      pdf.setFontSize(20)
      pdf.setTextColor(0, 0, 0)
      pdf.setFont('helvetica', 'normal')
      pdf.text('has successfully demonstrated competency in', 148.5, 130, { align: 'center' })

      pdf.setFontSize(28)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...secondaryColor)
      pdf.text(credentialData.skill || 'Professional Skill', 148.5, 145, { align: 'center' })

      // Date and credential ID
      const issueDate = new Date(credentialData.timestamp || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Issued on ${issueDate}`, 148.5, 160, { align: 'center' })
      pdf.text(`Credential ID: ${credentialData.id}`, 148.5, 170, { align: 'center' })

      // QR Code
      if (qrCode) {
        pdf.addImage(qrCode, 'PNG', 240, 120, 40, 40)
        pdf.setFontSize(10)
        pdf.text('Verify Online', 260, 170, { align: 'center' })
      }

      // Blockchain verification badge
      pdf.setDrawColor(...primaryColor)
      pdf.setLineWidth(2)
      pdf.circle(40, 140, 15, 'S')
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.text('BLOCKCHAIN', 40, 135, { align: 'center' })
      pdf.text('VERIFIED', 40, 145, { align: 'center' })

      // Footer
      pdf.setFontSize(10)
      pdf.setTextColor(150, 150, 150)
      pdf.text('This certificate is cryptographically secured on the blockchain', 148.5, 190, { align: 'center' })
      pdf.text(`Issuer: ${credentialData.issuerAddress || 'Authorized Educator'}`, 148.5, 200, { align: 'center' })

      return pdf.output('blob')
    } catch (error) {
      console.error('PDF generation error:', error)
      throw new Error('Failed to generate certificate PDF')
    }
  }

  /**
   * Generate certificate from HTML element
   * @param {HTMLElement} element - Element to convert to PDF
   * @param {Object} credentialData - Credential information
   * @param {Object} options - Conversion options
   * @returns {Promise<Blob>} PDF blob
   */
  static async generateCertificateFromHTML(element, credentialData, options = {}) {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#1F2A44',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        ...options
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 297 // A4 width in mm
      const pageHeight = 210 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      return pdf.output('blob')
    } catch (error) {
      console.error('HTML to PDF conversion error:', error)
      throw new Error('Failed to convert certificate to PDF')
    }
  }

  /**
   * Download file as blob
   * @param {Blob} blob - File blob
   * @param {string} filename - Download filename
   */
  static downloadBlob(blob, filename) {
    try {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      throw new Error('Failed to download file')
    }
  }

  /**
   * Generate shareable certificate image
   * @param {Object} credentialData - Credential information
   * @param {Object} options - Image options
   * @returns {Promise<string>} Base64 image data
   */
  static async generateCertificateImage(credentialData, options = {}) {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set canvas size
      canvas.width = options.width || 1200
      canvas.height = options.height || 800

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#1F2A44')
      gradient.addColorStop(0.5, '#2DD4BF')
      gradient.addColorStop(1, '#3B82F6')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add semi-transparent overlay
      ctx.fillStyle = 'rgba(31, 42, 68, 0.8)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Title
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 48px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('BLOCKCHAIN CERTIFICATE', canvas.width / 2, 100)

      // Subtitle
      ctx.font = '24px Arial, sans-serif'
      ctx.fillText('Verified on SkillCert Platform', canvas.width / 2, 140)

      // Recipient name
      ctx.font = 'bold 40px Arial, sans-serif'
      ctx.fillStyle = '#2DD4BF'
      ctx.fillText(credentialData.recipientName || 'Certified Individual', canvas.width / 2, 250)

      // Skill
      ctx.font = 'bold 36px Arial, sans-serif'
      ctx.fillStyle = '#3B82F6'
      ctx.fillText(`in ${credentialData.skill || 'Professional Skill'}`, canvas.width / 2, 320)

      // Date and ID
      ctx.font = '20px Arial, sans-serif'
      ctx.fillStyle = '#FFFFFF'
      const issueDate = new Date(credentialData.timestamp || Date.now()).toLocaleDateString()
      ctx.fillText(`Issued: ${issueDate}`, canvas.width / 2, 400)
      ctx.fillText(`ID: ${credentialData.id}`, canvas.width / 2, 430)

      // QR Code
      if (options.includeQR) {
        const qrCode = await this.generateQRCode(credentialData.id, { width: 150 })
        const qrImg = new Image()
        
        return new Promise((resolve, reject) => {
          qrImg.onload = () => {
            ctx.drawImage(qrImg, canvas.width - 200, canvas.height - 200, 150, 150)
            resolve(canvas.toDataURL('image/png'))
          }
          qrImg.onerror = reject
          qrImg.src = qrCode
        })
      }

      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Certificate image generation error:', error)
      throw new Error('Failed to generate certificate image')
    }
  }

  /**
   * Generate verification badge SVG
   * @param {Object} credentialData - Credential information
   * @param {Object} options - Badge options
   * @returns {string} SVG string
   */
  static generateVerificationBadge(credentialData, options = {}) {
    try {
      const size = options.size || 100
      const colors = {
        primary: options.primaryColor || '#2DD4BF',
        secondary: options.secondaryColor || '#3B82F6',
        text: options.textColor || '#FFFFFF'
      }

      return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Badge background -->
          <circle cx="50" cy="50" r="45" fill="url(#badgeGradient)" stroke="${colors.primary}" stroke-width="2"/>
          
          <!-- Shield icon -->
          <path d="M50 15 L40 20 Q40 35 50 45 Q60 35 60 20 Z" fill="${colors.text}" stroke="${colors.text}" stroke-width="1"/>
          
          <!-- Checkmark -->
          <path d="M42 38 L47 43 L58 32" fill="none" stroke="${colors.text}" stroke-width="3" stroke-linecap="round"/>
          
          <!-- Text -->
          <text x="50" y="65" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle" fill="${colors.text}">
            VERIFIED
          </text>
          <text x="50" y="75" font-family="Arial, sans-serif" font-size="6" text-anchor="middle" fill="${colors.text}">
            ${credentialData.skill || 'SKILL'}
          </text>
        </svg>
      `
    } catch (error) {
      console.error('Badge generation error:', error)
      throw new Error('Failed to generate verification badge')
    }
  }

  /**
   * Validate credential data for certificate generation
   * @param {Object} credentialData - Credential to validate
   * @returns {boolean} Whether data is valid
   */
  static validateCredentialData(credentialData) {
    const required = ['id', 'skill']
    return required.every(field => credentialData[field])
  }
}

export default CertificateUtils