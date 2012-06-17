
import new
import subprocess as sp

dry = False

def run(bk):
  cmd = bk.cmd
  print 'Running rsync command', cmd
  _run_bkup_cmd(cmd)

def all(items = new.Bkup.bkups):
  """
  run each backup in the given list 'items'.  The default is to run every backup
  created tracked via the Bkup class static bkups list.
  """
  for bk in items:
    run(bk)

def for_tags(names):
  """run every backup instruction having a tag listed in 'names'"""
  bkups = []
  for bk in new.Bkup.bkups:
    for name in names:
      if name in bk.tags:
        bkups.append(bk)
        break # run each bk only once
  run_all(items = bkups)

def _run_bkup_cmd(cmd):
  if dry:
    return

  p = sp.Popen(cmd, stdout = sp.PIPE, stderr = sp.PIPE)
  out, err = p.communicate()

  print '\n'.join(out.splitlines()[-2:])
  if p.returncode != 0:
    print err

