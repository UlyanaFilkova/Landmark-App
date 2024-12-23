export const convertFilesToBase64 = (files: File[]): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    if (files.length === 0) {
      resolve([])
      return
    }

    const base64Files: string[] = []
    let processedCount = 0

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        base64Files.push(reader.result as string)
        processedCount++
        if (processedCount === files.length) {
          resolve(base64Files)
        }
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsDataURL(file)
    })
  })
}

export const convertBase64ToFiles = (base64Strings: string[]): File[] => {
  return base64Strings.map((base64, index) => {
    const byteString = atob(base64.split(',')[1])
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: mimeString })
    return new File([blob], `photo_${index + 1}.${mimeString.split('/')[1]}`, { type: mimeString })
  })
}
