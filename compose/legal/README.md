# Legal texts

The app shows the files in this folder to everyone who uses this installation:

- `terms.html`: the terms of use
- `privacy.html`: the privacy policy
- `imprint.html`: the imprint (legal notice)

Write plain HTML fragments: headings, paragraphs, lists and links. A missing file shows a placeholder.
Restart the apiserver after changing a file. To keep the texts somewhere else, point `LEGAL_DIR` in
`.env` at that folder.
