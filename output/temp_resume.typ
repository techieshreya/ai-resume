
    #set page(
      paper: "us-letter",
      margin: (x: 1.5cm, y: 1.5cm),
    )
    #set text(font: "Linux Libertine", size: 11pt)
    
    // Header
    #align(center)[
      #text(size: 17pt, weight: "bold")[Techieshreya]       #link("https://github.com/techieshreya")[github.com/techieshreya] | your.email\@example.com
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
#project_item("Demo Project 2", "Docker, FastAPI", ("*   Deployed a new microservice into production environments, leveraging containerization technologies and automated CI/CD pipelines.", "*   Enhanced application scalability and resilience, facilitating faster feature development and improving overall system modularity."))
#project_item("Demo Project 1", "Python, React", ("*   **Developed and successfully launched an innovative application**, overseeing the complete product lifecycle from initial concept to public deployment.", "*   **Engineered key user-centric features and intuitive UI/UX design**, resulting in a highly engaging and streamlined user experience."))
