export function formatStationName(name) {
    const words = name.split(' ').filter(Boolean); 
    const firstTwoWords = words.slice(0, 2); 
  
    if (words.length === 1) {
      
      return words[0]
        .replace(/[!@#$()'^+%&=?*-,."]/g, '') 
        .slice(0, 2)
    }
  
    return firstTwoWords
      .map((word) =>
        word
          .replace(/[!@#$()'^+%&=?*-,."]/g, '')
          .slice(0, 1)
      )
      .join('');
}

export function formatStationTag(tag) {
  const words = tag.split(' ').filter(Boolean);
  const firstWord = words[0] || ''; 
  const secondWord = words[1] || ''; 
  const formattedTag = `${firstWord} ${
    secondWord.slice(0, 3) ? secondWord.slice(0, 3) + '..' : ''
  }`;

  return formattedTag.trim();
}

  
  
  