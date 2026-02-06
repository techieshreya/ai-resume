// templates/modern.typ

#let resume(data) = {
  set page(margin: (x: 1.5cm, y: 1.5cm))
  set text(font: "Linux Libertine", size: 11pt)

  // --- HEADER ---
  align(center)[
    #text(size: 17pt, weight: "bold")[#data.name] \
    #link("https://github.com/" + data.github)[github.com/#data.github] | #data.email
    #line(length: 100%, stroke: 1pt + gray)
  ]

  // --- SUMMARY ---
  if data.bio != "" [
    == Summary
    #data.bio
  ]

  // --- PROJECTS ---
  if data.projects != none and data.projects.len() > 0 [
    == Projects
    #for p in data.projects [
      #block(below: 1em)[
        #grid(
          columns: (1fr, auto),
          [*#p.name*],
          text(style: "italic")[#p.tech]
        )
        // Handle bullets safely inside Typst
        #for point in p.bullets [
          - #point
        ]
      ]
    ]
  ]
}