
    #set page(
      paper: "us-letter",
      margin: (x: 1.5cm, y: 1.5cm),
    )
    #set text(font: "Linux Libertine", size: 11pt)
    
    // Header
    #align(center)[
      #text(size: 17pt, weight: "bold")[Ayush Chauhan]       #link("https://github.com/Ayushchauhan9389")[github.com/Ayushchauhan9389] | your.email\@example.com
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
    
    
== Projects
#project_item("next-template", "TypeScript", ("Nextjs Template configured with Drizzle orm and Clerk Auth"))
#project_item("Exam-portal", "TypeScript", ("No description provided."))
#project_item("Exam-Platform-backend", "TypeScript", ("No description provided."))
#project_item("travelblogv2", "TypeScript", ("Travel blog v2 with vercel Prostgres and blob"))
#project_item("clusterkabot", "Python", ("No description provided."))
