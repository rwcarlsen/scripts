
import os

class Splitter(object):
  
  def __init__(self, line = '', path = '', linenum = 0):
    self._linenum = linenum
    self._delims = []

    if path != '':
      with open(path, 'r') as f:
        self._lines = f.readlines()
    else:
      self._lines = [line]
      self._linenum = 0

  def getLineNum(self):
    return self._linenum
  def setLineNum(self, val):
    self._linenum = val
  linenum = property(getLineNum, setLineNum)

  def getDelims(self):
    return list(self._delims)
  def setDelims(self, delims):
    self._delims = list(delims)
  delims = property(getDelims, setDelims)

  def addDelim(self, delim):
    self._delims.append(delim)

  def getOrder(self):
    return list(self._order)
  def setOrder(self, order):
    self._order = list(order)
  order = property(getOrder, setOrder)

  def rawLine(self):
    return self._lines[self._linenum - 1].strip()

  def lineArray(self):
    text = self.rawLine()
    pos = 0
    result = []

    while pos < len(text):
      nextstart = len(text) - 1
      nextdelim = ''
      for d in self._delims:
        start = text.find(d, pos)
        if start < 0:
          continue
        if start < nextstart:
          nextstart = start
          nextdelim = d
      if nextdelim == '':
        nextstart = len(text)
      toadd = text[pos:nextstart]
      pos = nextstart + len(nextdelim)
      if len(toadd) == 0:
        continue
      result.append(toadd)

    return result

  def orderedLineArray(self):
    unordered = self.lineArray()
    ordered = []
    for spot in self._order:
      ordered.append(unordered[spot - 1])
    return ordered

if __name__ == '__main__':
  splitter = Splitter('hello\t\t how are you')
  splitter.delims = ['\t', '\n', ' ', '\r']
  splitter.order = [2, 1, 3, 4]
  print splitter.rawLine()
  print splitter.lineArray()
  print splitter.orderedLineArray()
