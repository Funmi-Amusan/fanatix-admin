export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  export const formatClearDate = (
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const d = new Date(date);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short', 
      day: '2-digit', 
    };
  
    return d.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  };

export const formatToAPIDate = (dateStr: string | undefined) => {
    if (!dateStr) return undefined;
    const iso = new Date(dateStr).toISOString();
    return iso.split('.')[0] + 'Z';
  };
  