import type { Requirement } from "@/components/results-display"

export function exportToExcel(requirements: Requirement[], sourceFileName: string) {
  // Separate requirements by category
  const hardwareReqs = requirements.filter(r => r.category === "hardware")
  const softwareReqs = requirements.filter(r => r.category === "software")

  // Create CSV content (more compatible, no external dependencies)
  const timestamp = new Date().toISOString().split('T')[0]
  const fileName = `Requirements_Analysis_${sourceFileName.replace(/\.[^/.]+$/, '')}_${timestamp}`

  // Build CSV content with proper escaping
  const escapeCsv = (text: string): string => {
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`
    }
    return text
  }

  let csvContent = ''

  // Add header information
  csvContent += 'Government of India - Requirements Analysis Report\n'
  csvContent += `Generated Date,${new Date().toLocaleDateString('en-IN')}\n`
  csvContent += `Source Document,${escapeCsv(sourceFileName)}\n`
  csvContent += `Total Requirements,${requirements.length}\n`
  csvContent += `Hardware Requirements,${hardwareReqs.length}\n`
  csvContent += `Software Requirements,${softwareReqs.length}\n`
  csvContent += '\n'

  // Hardware Requirements Section
  csvContent += 'HARDWARE REQUIREMENTS\n'
  csvContent += 'S.No.,Requirement Description,Sub-Category,Confidence Score\n'
  hardwareReqs.forEach((req, index) => {
    csvContent += `${index + 1},${escapeCsv(req.text)},${escapeCsv(req.subCategory)},${Math.round(req.confidence * 100)}%\n`
  })
  csvContent += '\n'

  // Software Requirements Section
  csvContent += 'SOFTWARE REQUIREMENTS\n'
  csvContent += 'S.No.,Requirement Description,Sub-Category,Confidence Score\n'
  softwareReqs.forEach((req, index) => {
    csvContent += `${index + 1},${escapeCsv(req.text)},${escapeCsv(req.subCategory)},${Math.round(req.confidence * 100)}%\n`
  })
  csvContent += '\n'

  // All Requirements (Combined)
  csvContent += 'ALL REQUIREMENTS (COMBINED)\n'
  csvContent += 'S.No.,Requirement Description,Category,Sub-Category,Confidence Score\n'
  requirements.forEach((req, index) => {
    csvContent += `${index + 1},${escapeCsv(req.text)},${req.category.toUpperCase()},${escapeCsv(req.subCategory)},${Math.round(req.confidence * 100)}%\n`
  })

  // Summary Statistics
  csvContent += '\n'
  csvContent += 'CATEGORY-WISE SUMMARY\n'
  csvContent += 'Category,Sub-Category,Count\n'
  
  // Hardware summary
  const hardwareGroups = hardwareReqs.reduce((acc, req) => {
    acc[req.subCategory] = (acc[req.subCategory] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  Object.entries(hardwareGroups).forEach(([subCat, count]) => {
    csvContent += `Hardware,${escapeCsv(subCat)},${count}\n`
  })

  // Software summary
  const softwareGroups = softwareReqs.reduce((acc, req) => {
    acc[req.subCategory] = (acc[req.subCategory] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  Object.entries(softwareGroups).forEach(([subCat, count]) => {
    csvContent += `Software,${escapeCsv(subCat)},${count}\n`
  })

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export to proper Excel format using xlsx library (optional enhancement)
export async function exportToExcelXlsx(requirements: Requirement[], sourceFileName: string) {
  // This would use the xlsx library for proper Excel format
  // For now, we use CSV which is universally compatible
  exportToExcel(requirements, sourceFileName)
}
