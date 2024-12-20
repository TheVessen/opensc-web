import { Button, getPosts, Section } from "@/components";
import {
  Maturity,
  parseProjects,
  Project,
  validMaturities,
} from "@/components/src/projectUtils";

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Projects() {
  let projects = getPosts("projects");
  let parsedProjects = parseProjects(projects);

  const projectsByMaturity = parsedProjects.reduce<Record<Maturity, Project[]>>(
    (acc, project) => {
      if (!acc[project.maturity]) {
        acc[project.maturity] = [];
      }
      acc[project.maturity].push(project);
      return acc;
    },
    {} as Record<Maturity, Project[]>,
  );

  const sortedProjectsByMaturity = Object.entries(projectsByMaturity).sort(
    ([a], [b]) =>
      validMaturities.indexOf(a as Maturity) -
      validMaturities.indexOf(b as Maturity),
  );

  //Set the color of the section based on the maturity of the projects
  const maturityColors: Record<Maturity, string> = {
    sandbox: "",
    incubation: "slate-300",
    graduated: "primary-500",
  };

  const maturitySubtext: Record<Maturity, string> = {
    sandbox: "Experimental projects not yet widely tested in production",
    incubation:
      "Projects used successfully in production by a small number of users",
    graduated:
      "Projects considered stable, widely adopted and production ready, attracting hundreds of users and contributors",
  };

  //TODO: Improve the layout of this page especially regarding visual hierarchy
  //TODO: Either create a special card for projects in the project dir  or use a different layout

  return (
    <div className="mt-28 prose-h2:mt-0 md:mt-0 md:prose-h2:text-2xl md:prose-h3:text-xl">
      <Section>
        <h1 className="py-6 text-xl font-bold  md:text-4xl">Projects</h1>
        <p>
          The os.c marketplace is THE place to publish open source code with one
          idea in mind: To reduce the incredible duplication of efforts that
          really slows down innovation in the AECO industry. The idea of this
          space is to collect a mix of open source projects. Small scripts, that
          you wish you would have at hand instead of building it yourself.
          Larger projects, that help you move faster. Any code, that is helpful
          to others. Very soon, you will be able to push your open source code
          via GitHub to our website. We will include your project in the
          newsletter and organise an community call to make you and your code
          known. This way, you will find code. But also heaps of talented
          people, ready to push the industry further. Step by step and never
          stopping.
        </p>

        <div className="pt-4">
          <Button
            target="/#contact-us"
            label="Want to submit a project yourself?"
            type="primary"
          />
        </div>
      </Section>

      {sortedProjectsByMaturity.map(([projectMaturity, projects]) => (
        <Section
          key={projectMaturity}
          color={maturityColors[projectMaturity as Maturity]}
        >
          <div className="mb-16">
            <h1 className="py-6 text-xl font-bold  md:text-3xl">
              {capitalizeFirstLetter(projectMaturity)}
            </h1>

            <p className="text-gray-500 text-sm">
              {maturitySubtext[projectMaturity as Maturity]}
            </p>

            <div className="grid gap-12 py-10 md:mt-16 lg:grid-cols-2 lg:gap-5">
              {projects.map(({ slug, title, description }, index) => (
                <div
                  className={`bg-${projectMaturity === "sandbox" ? "slate-300" : "white"}`}
                  key={index}
                >
                  <div className="p-5">
                    <h4 className="mb-2 mt-0 text-xl font-bold md:text-2xl">
                      {title}
                    </h4>
                    <div className="mb-12">{description}</div>

                    <Button
                      label="More about the project"
                      target={`/projects/${slug}`}
                      type="primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      ))}
    </div>
  );
}
