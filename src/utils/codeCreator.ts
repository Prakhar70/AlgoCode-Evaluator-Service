export default function CodeCreator(startingCode:string, middleCode:string, endCode:string):string{

    return `
    ${startingCode}
    ${middleCode}
    ${endCode}
    `;
}

/**
 * for python and java endCode could be empty string
 */