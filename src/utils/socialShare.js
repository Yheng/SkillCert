/**
 * Social sharing utility functions
 */
class SocialShare {
  /**
   * Share credential on LinkedIn
   * @param {Object} credential - Credential data
   * @param {Object} options - Share options
   */
  static shareOnLinkedIn(credential, options = {}) {
    const baseUrl = 'https://www.linkedin.com/sharing/share-offsite/'
    const shareData = {
      url: `${window.location.origin}/verify/${credential.id}`,
      title: `${credential.skill} Certification`,
      summary: `I've earned a blockchain-verified credential in ${credential.skill} on SkillCert! This tamper-proof certificate demonstrates my professional expertise.`,
      source: 'SkillCert'
    }

    const params = new URLSearchParams({
      url: shareData.url,
      title: shareData.title,
      summary: shareData.summary,
      source: shareData.source
    })

    const shareUrl = `${baseUrl}?${params.toString()}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  /**
   * Share credential on Twitter
   * @param {Object} credential - Credential data
   * @param {Object} options - Share options
   */
  static shareOnTwitter(credential, options = {}) {
    const baseUrl = 'https://twitter.com/intent/tweet'
    const shareData = {
      text: `🎓 Just earned my ${credential.skill} certification on @SkillCert! Blockchain-verified and tamper-proof. #BlockchainCertification #SkillCert #${credential.skill.replace(/\s+/g, '')}`,
      url: `${window.location.origin}/verify/${credential.id}`,
      hashtags: ['SkillCert', 'BlockchainCertified', credential.skill.replace(/\s+/g, '')]
    }

    const params = new URLSearchParams({
      text: shareData.text,
      url: shareData.url
    })

    const shareUrl = `${baseUrl}?${params.toString()}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  /**
   * Share credential on Facebook
   * @param {Object} credential - Credential data
   * @param {Object} options - Share options
   */
  static shareOnFacebook(credential, options = {}) {
    const baseUrl = 'https://www.facebook.com/sharer/sharer.php'
    const shareData = {
      u: `${window.location.origin}/verify/${credential.id}`,
      quote: `I've earned a blockchain-verified ${credential.skill} certification on SkillCert!`
    }

    const params = new URLSearchParams(shareData)
    const shareUrl = `${baseUrl}?${params.toString()}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  /**
   * Share via email
   * @param {Object} credential - Credential data
   * @param {Object} options - Share options
   */
  static shareViaEmail(credential, options = {}) {
    const subject = encodeURIComponent(`My ${credential.skill} Certification`)
    const body = encodeURIComponent(`
Hi,

I'm excited to share that I've earned a blockchain-verified certification in ${credential.skill}!

You can verify my credential here:
${window.location.origin}/verify/${credential.id}

This certificate is:
✅ Tamper-proof and stored on the blockchain
✅ Instantly verifiable anywhere in the world  
✅ Contains cryptographic proof of authenticity

Learn more about SkillCert: ${window.location.origin}

Best regards
    `.trim())

    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
    window.location.href = mailtoUrl
  }

  /**
   * Copy verification link to clipboard
   * @param {Object} credential - Credential data
   * @returns {Promise<boolean>} Success status
   */
  static async copyVerificationLink(credential) {
    try {
      const verificationUrl = `${window.location.origin}/verify/${credential.id}`
      await navigator.clipboard.writeText(verificationUrl)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  /**
   * Generate QR code for social sharing
   * @param {Object} credential - Credential data
   * @param {Object} options - QR options
   * @returns {Promise<string>} QR code data URL
   */
  static async generateSocialQR(credential, options = {}) {
    const QRCode = await import('qrcode')
    const verificationUrl = `${window.location.origin}/verify/${credential.id}`
    
    const qrOptions = {
      width: options.width || 300,
      color: {
        dark: '#2DD4BF',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M',
      margin: 2,
      ...options
    }

    return await QRCode.toDataURL(verificationUrl, qrOptions)
  }

  /**
   * Share using Web Share API (mobile/modern browsers)
   * @param {Object} credential - Credential data
   * @returns {Promise<boolean>} Success status
   */
  static async shareNative(credential) {
    if (!navigator.share) {
      return false
    }

    try {
      const shareData = {
        title: `${credential.skill} Certification`,
        text: `I've earned a blockchain-verified credential in ${credential.skill} on SkillCert!`,
        url: `${window.location.origin}/verify/${credential.id}`
      }

      await navigator.share(shareData)
      return true
    } catch (error) {
      console.error('Native share failed:', error)
      return false
    }
  }

  /**
   * Add credential to professional portfolio sites
   * @param {Object} credential - Credential data
   * @param {string} platform - Portfolio platform
   */
  static addToPortfolio(credential, platform) {
    const portfolioUrls = {
      credly: 'https://credly.com',
      badgelist: 'https://badgelist.com',
      accredible: 'https://accredible.com'
    }

    const baseUrl = portfolioUrls[platform]
    if (!baseUrl) {
      console.error('Unsupported portfolio platform:', platform)
      return
    }

    // Note: Each platform would have its own integration method
    // This is a placeholder for future integrations
    window.open(baseUrl, '_blank')
  }

  /**
   * Generate social media post content
   * @param {Object} credential - Credential data
   * @param {string} platform - Social platform
   * @returns {Object} Post content
   */
  static generatePostContent(credential, platform) {
    const verificationUrl = `${window.location.origin}/verify/${credential.id}`
    const skillTag = credential.skill.replace(/\s+/g, '')

    const content = {
      linkedin: {
        title: `🎓 ${credential.skill} Certification Earned`,
        text: `I'm proud to share that I've successfully earned a blockchain-verified certification in ${credential.skill} through SkillCert!\n\nThis tamper-proof credential demonstrates my professional expertise and is instantly verifiable worldwide.\n\n✅ Blockchain-secured\n✅ Cryptographically verified\n✅ Globally recognized\n\nView my credential: ${verificationUrl}\n\n#${skillTag} #BlockchainCertification #ProfessionalDevelopment #SkillCert`,
        hashtags: [skillTag, 'BlockchainCertification', 'ProfessionalDevelopment', 'SkillCert']
      },
      twitter: {
        title: `🚀 New Achievement Unlocked!`,
        text: `Just earned my ${credential.skill} certification on @SkillCert! 🎓\n\n✨ Blockchain-verified\n🔒 Tamper-proof  \n🌍 Globally verifiable\n\nVerify: ${verificationUrl}\n\n#${skillTag} #BlockchainCerts`,
        hashtags: [skillTag, 'BlockchainCerts', 'Web3Education']
      },
      facebook: {
        title: `${credential.skill} Certification Achievement`,
        text: `Excited to announce that I've earned a blockchain-verified ${credential.skill} certification! This cutting-edge credential is secured on the blockchain and can be instantly verified by anyone, anywhere.\n\nVerify my credential: ${verificationUrl}`,
        hashtags: []
      },
      instagram: {
        title: `New Achievement 🎓`,
        text: `Just earned my ${credential.skill} certification! 🚀\n\n✨ Blockchain-verified\n🔒 Tamper-proof\n🌍 Instantly verifiable\n\n#${skillTag} #BlockchainCertification #Achievement #SkillCert #ProfessionalGrowth`,
        hashtags: [skillTag, 'BlockchainCertification', 'Achievement', 'SkillCert', 'ProfessionalGrowth']
      }
    }

    return content[platform] || content.linkedin
  }

  /**
   * Create downloadable social media assets
   * @param {Object} credential - Credential data
   * @param {string} format - Asset format (image, story, etc.)
   * @returns {Promise<Blob>} Asset blob
   */
  static async createSocialAsset(credential, format = 'post') {
    try {
      const CertificateUtils = await import('./certificateUtils')
      
      const assetOptions = {
        post: { width: 1200, height: 630 }, // Facebook/LinkedIn post
        story: { width: 1080, height: 1920 }, // Instagram/Snapchat story
        square: { width: 1080, height: 1080 }, // Instagram square post
        twitter: { width: 1200, height: 675 } // Twitter card
      }

      const dimensions = assetOptions[format] || assetOptions.post
      
      const imageDataUrl = await CertificateUtils.default.generateCertificateImage(credential, {
        ...dimensions,
        includeQR: true,
        socialFormat: format
      })

      const response = await fetch(imageDataUrl)
      return await response.blob()
    } catch (error) {
      console.error('Failed to create social asset:', error)
      throw error
    }
  }
}

export default SocialShare