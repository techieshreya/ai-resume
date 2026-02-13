
    #set page(
      paper: "us-letter",
      margin: (x: 1.5cm, y: 1.5cm),
    )
    #set text(font: "Linux Libertine", size: 11pt)
    
    // Header
    #align(center)[
      #text(size: 17pt, weight: "bold")[Your Name]       #link("https://github.com/github")[github.com/github] | email\@example.com
      #line(length: 100%, stroke: 1pt + gray)
    ]
    
    // Project Helper Function
    #let project_item(name, tech, bullets) = {
      block(below: 1em)[
        #grid(
          columns: (1fr, auto),
          [*#name*],
          text(style: "italic")[#tech]
        )
        #for b in bullets [ - #b \ ]
      ]
    }
    
    // --- SUMMARY ---
    == Summary
    Aspiring Software Engineer...
    
== Projects
#project_item("Project Alpha", "Python, Docker", ("No description provided."))
#project_item("Project Beta", "React, CSS", ("No description provided."))
#project_item("Project Gamma", "Python, FastAPI", ("No description provided."))
