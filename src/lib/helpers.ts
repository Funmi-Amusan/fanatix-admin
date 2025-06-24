export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

export const formatToAPIDate = (dateStr: string | undefined) => {
    if (!dateStr) return undefined;
    const iso = new Date(dateStr).toISOString();
    return iso.split('.')[0] + 'Z';
  };
  