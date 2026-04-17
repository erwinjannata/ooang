export function startOfDate({ suppliedDate }: { suppliedDate: Date }): Date {
    const d = new Date(suppliedDate)
    d.setHours(0, 0, 0, 0)
    return d
}

export function endOfDate({ suppliedDate }: { suppliedDate: Date }): Date {
    const d = new Date(suppliedDate)
    d.setHours(23, 59, 59, 999)
    return d
}

export function dayRangeISO(dateFrom: Date, dateThru: Date, tzOffset = '+08:00') {
  const yyyy = dateFrom.getFullYear();
  const mm = String(dateFrom.getMonth() + 1).padStart(2, '0');
  const dd = String(dateFrom.getDate()).padStart(2, '0');
  
  const yyyy2 = dateThru.getFullYear();
  const mm2 = String(dateThru.getMonth() + 1).padStart(2, '0');
  const dd2 = String(dateThru.getDate()).padStart(2, '0');

  return {
    from: `${yyyy}-${mm}-${dd}T00:00:00${tzOffset}`,
    to:   `${yyyy2}-${mm2}-${dd2}T23:59:59.999${tzOffset}`,
  };
}