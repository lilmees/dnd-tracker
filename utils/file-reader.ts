export function readFile (file: File, cb): void {
  const reader = new FileReader()

  reader.onload = (e: ProgressEvent) => {
    cb(e)
  }

  reader.readAsDataURL(file)
}
