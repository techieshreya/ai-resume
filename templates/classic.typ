// templates/classic.typ

#let resume(data) = {
  set page(margin: (x: 2cm, y: 2cm))
  set text(font: "New Computer Modern", size: 10pt) // Traditional Serif Font

  // --- CLASSIC CENTERED HEADER ---
  align(center)[
    #text(size: 22pt, weight: "bold")[#data.name] \
    #v(0.5em)
    #data.email | #link("https://github.com/" + data.github)[github.com/#data.github]
    #line(length: 100%, stroke: 0.5pt + black)
  ]

  // --- SUMMARY ---
  if data.bio != "" [
    #v(1em)
    #align(center)[*Summary*]
    #align(center)[#data.bio]
  ]

  // --- PROJECTS ---
  if data.projects != none and data.projects.len() > 0 [
    #v(1em)
    #align(center)[*Professional Projects*]
    #line(length: 100%, stroke: 0.5pt + gray)
    
    #for p in data.projects [
      #block(below: 1em)[
        #grid(
          columns: (1fr, auto),
          text(weight: "bold", size: 11pt)[#p.name],
          text(style: "italic")[#p.tech]
        )
        // Bullets with a different marker
        #for point in p.bullets [
          #h(1em) $circ$ #point \
        ]
      ]
    ]
  ]
}