import githubNewtab from "./githubNewtab";
import vsMusic from "./vs-music";

export const projectsData = {
    [githubNewtab.id]: githubNewtab,
    [vsMusic.id]: vsMusic
}

export const projectList = Object.keys(projectsData);