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
   * Generate clean, professional certificate PDF with subtle blockchain enhancements
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

      // Generate QR code for verification - Use consistent ID
      const certificateId = credentialData.blockchain_id || credentialData.id || 'unknown'
      const qrCode = await this.generateQRCode(certificateId, {
        width: 120,
        height: 120,
        margin: 1
      })

      // Professional color palette inspired by UAE Design System
      const darkNavy = [31, 41, 55]     // Professional dark text
      const vibrantTeal = [20, 184, 166] // Blockchain accent color
      const warmGold = [251, 191, 36]    // Premium accent
      const softGray = [107, 114, 128]   // Secondary text
      const lightGray = [243, 244, 246]  // Background accent
      const pureWhite = [255, 255, 255]  // Clean background
      const subtleAccent = [240, 253, 250] // Very light teal for backgrounds

      // Clean white background
      pdf.setFillColor(...pureWhite)
      pdf.rect(0, 0, 297, 210, 'F')

      // Subtle decorative corner elements (inspired by UAE Design System patterns)
      pdf.setFillColor(240, 253, 250) // Very subtle teal
      // Simple corner rectangles as accents
      pdf.rect(0, 0, 25, 8, 'F') // Top-left
      pdf.rect(272, 0, 25, 8, 'F') // Top-right  
      pdf.rect(0, 202, 25, 8, 'F') // Bottom-left
      pdf.rect(272, 202, 25, 8, 'F') // Bottom-right

      // Professional header border with subtle gradient effect
      pdf.setDrawColor(...vibrantTeal)
      pdf.setLineWidth(3)
      pdf.line(30, 25, 267, 25)
      
      // Subtle complementary line below main border
      pdf.setDrawColor(...vibrantTeal)
      pdf.setLineWidth(0.5)
      pdf.line(30, 27, 267, 27)

      // HEADER - Clean and centered
      pdf.setFontSize(48)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...darkNavy)
      pdf.text('SkillCert', 148.5, 45, { align: 'center' })
      
      pdf.setFontSize(14)
      pdf.setTextColor(...vibrantTeal)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Blockchain Certificate of Achievement', 148.5, 55, { align: 'center' })

      // Subtle blockchain network icon (hexagon-based pattern inspired by Tabler Icons)
      CertificateUtils.drawBlockchainIcon(pdf, 45, 45, 8, vibrantTeal, 0.15)
      CertificateUtils.drawBlockchainIcon(pdf, 252, 45, 8, vibrantTeal, 0.15)

      // Simple divider line with subtle geometric accents
      pdf.setDrawColor(...softGray)
      pdf.setLineWidth(1)
      pdf.line(80, 65, 217, 65)
      
      // Small decorative elements around divider
      pdf.setFillColor(...vibrantTeal)
      pdf.circle(75, 65, 1.5, 'F')
      pdf.circle(222, 65, 1.5, 'F')

      // CERTIFICATE CONTENT - Clean and centered
      const centerX = 148.5
      
      // Introduction text
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...darkNavy)
      pdf.text('This is to certify that', centerX, 85, { align: 'center' })

      // RECIPIENT NAME - Prominent and clean
      pdf.setFontSize(38)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...darkNavy)
      const recipientName = credentialData.recipientName || 'Alex Freelancer'
      pdf.text(recipientName, centerX, 105, { align: 'center' })

      // Simple underline for name
      pdf.setDrawColor(...vibrantTeal)
      pdf.setLineWidth(2)
      const nameWidth = pdf.getTextWidth(recipientName)
      const lineStartX = centerX - (nameWidth / 2)
      const lineEndX = centerX + (nameWidth / 2)
      pdf.line(lineStartX, 110, lineEndX, 110)

      // Achievement text
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...darkNavy)
      pdf.text('has successfully completed the requirements for', centerX, 125, { align: 'center' })

      // SKILL NAME - Clear and prominent
      pdf.setFontSize(28)
      pdf.setTextColor(...vibrantTeal)
      pdf.setFont('helvetica', 'bold')
      const skillName = (credentialData.skill || 'Professional Skill')
      pdf.text(skillName, centerX, 145, { align: 'center' })

      // Simple underline for skill
      pdf.setDrawColor(...warmGold)
      pdf.setLineWidth(1)
      const skillWidth = pdf.getTextWidth(skillName)
      const skillLineStartX = centerX - (skillWidth / 2)
      const skillLineEndX = centerX + (skillWidth / 2)
      pdf.line(skillLineStartX, 150, skillLineEndX, 150)

      // Description
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...softGray)
      pdf.text('This certification is blockchain-verified and represents mastery of professional skills', centerX, 165, { align: 'center' })

      // LEFT SIDE - Date box (clean and simple)
      pdf.setDrawColor(...vibrantTeal)
      pdf.setLineWidth(1)
      pdf.rect(30, 175, 40, 20, 'S')
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...darkNavy)
      pdf.text('DATE ISSUED', 50, 182, { align: 'center' })
      
      const issueDate = new Date(credentialData.timestamp || Date.now()).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.text(issueDate, 50, 190, { align: 'center' })

      // RIGHT SIDE - QR Code (clean and simple)
      if (qrCode) {
        pdf.setDrawColor(...vibrantTeal)
        pdf.setLineWidth(1)
        pdf.rect(227, 175, 40, 20, 'S')
        
        pdf.addImage(qrCode, 'PNG', 229, 150, 18, 18)
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(...darkNavy)
        pdf.text('BLOCKCHAIN', 247, 182, { align: 'center' })
        pdf.text('VERIFIED', 247, 190, { align: 'center' })
      }

      // SIGNATURE AREA - Simple and professional
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'italic')
      pdf.setTextColor(...darkNavy)
      pdf.text('Digitally Certified', centerX, 175, { align: 'center' })
      
      // Signature line
      pdf.setDrawColor(...darkNavy)
      pdf.setLineWidth(1)
      pdf.line(centerX - 25, 182, centerX + 25, 182)
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...softGray)
      pdf.text('SkillCert Platform', centerX, 189, { align: 'center' })

      // FOOTER - Simple and clean
      pdf.setDrawColor(...vibrantTeal)
      pdf.setLineWidth(2)
      pdf.line(30, 200, 267, 200)
      
      pdf.setFontSize(8)
      pdf.setTextColor(...softGray)
      pdf.text(`Certificate ID: ${certificateId}`, centerX, 206, { align: 'center' })

      // Subtle professional footer enhancements
      // Geometric pattern lines (inspired by professional certificates)
      pdf.setDrawColor(...softGray)
      pdf.setLineWidth(0.3)
      for (let i = 0; i < 5; i++) {
        const x = 40 + i * 45
        pdf.line(x, 202, x + 25, 202)
      }

      return pdf.output('blob')
    } catch (error) {
      console.error('PDF generation error:', error)
      throw new Error('Failed to generate certificate PDF')
    }
  }

  /**
   * Draw a subtle blockchain network icon (simplified geometric pattern)
   * @param {Object} pdf - jsPDF instance
   * @param {number} x - X coordinate center
   * @param {number} y - Y coordinate center
   * @param {number} size - Icon size
   * @param {Array} color - RGB color array
   * @param {number} opacity - Opacity (0-1, not used for compatibility)
   */
  static drawBlockchainIcon(pdf, x, y, size, color, opacity = 0.2) {
    const [r, g, b] = color
    
    // Use lighter teal colors for subtlety
    pdf.setFillColor(178, 230, 226) // Very light teal
    pdf.setDrawColor(134, 207, 202) // Light teal
    pdf.setLineWidth(0.5)
    
    // Main hexagon using simple shapes (central node)
    pdf.circle(x, y, size * 0.6, 'FD')
    
    // Network connection lines (subtle)
    pdf.setDrawColor(178, 230, 226)
    pdf.setLineWidth(0.3)
    
    // Connection points in hexagonal pattern
    const angles = [0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3]
    angles.forEach(angle => {
      const endX = x + size * 1.2 * Math.cos(angle)
      const endY = y + size * 1.2 * Math.sin(angle)
      
      // Connection line
      pdf.line(x, y, endX, endY)
      
      // Small node at end
      pdf.setFillColor(200, 240, 235) // Very subtle teal
      pdf.circle(endX, endY, size * 0.2, 'F')
    })
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