export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export const getPercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous * 100).toFixed(1)
}

export const getCategoryColor = (categories, categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat?.color || '#6b7280'
}

export const getCategoryName = (categories, categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat?.name || 'Other'
}

export const exportToCSV = (data, filename = 'transactions') => {
  const headers = ['Date', 'Description', 'Amount', 'Category', 'Type']
  const csvRows = [
    headers.join(','),
    ...data.map(t =>
      [t.date, `"${t.description}"`, t.amount, t.category, t.type].join(',')
    ),
  ]
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportToJSON = (data, filename = 'transactions') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.json`
  a.click()
  URL.revokeObjectURL(url)
}
