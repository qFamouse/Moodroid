export enum QuestionType {
    multichoice = "multichoice", // radio & checkbox
    match = "match", // select

    shortanswer = "shortanswer", // small input
    multianswer = "multianswer", // in practice, I have not met. Has been founded in the source files. When applied, this class slightly increases the 'shortanswer'
    rightanswer = "rightanswer", // in practice, I have not met. Has been founded in the source files. When applied, this class slightly increases the 'shortanswer'
    essay = "essay" // textarea
}
