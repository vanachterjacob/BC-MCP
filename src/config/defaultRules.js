/**
 * Default cursor editor rules for AL development in Business Central
 */
const defaultRules = {
    // AL Formatting rules
    formatting: {
        id: 'al-formatting',
        name: 'AL Code Formatting',
        description: 'Default formatting rules for AL code in Business Central',
        type: 'formatter',
        content: {
            indentation: {
                size: 4,
                useSpaces: true,
                tabSize: 4
            },
            alignment: {
                alignVariableDeclarations: true,
                alignAssignments: true,
                alignComments: true,
                alignParameters: true
            },
            braces: {
                bracesOnNewLine: true,
                spaceBeforeOpenBrace: true,
                spaceAfterOpenBrace: false,
                spaceBeforeCloseBrace: false,
                bracesForControlBlocks: true
            },
            spacing: {
                spaceAfterComma: true,
                spaceAfterSemicolon: true,
                spaceAroundOperators: true,
                spaceAfterKeywords: true,
                spaceBeforeParentheses: true
            },
            newLines: {
                maxEmptyLines: 1,
                endWithNewLine: true,
                separateProceduresWithNewLines: true,
                separateRegionsWithNewLines: true
            }
        },
        version: '1.0.0'
    },

    // AL Code Analysis rules
    codeAnalysis: {
        id: 'al-code-analysis',
        name: 'AL Code Analysis',
        description: 'Rules for static code analysis of AL code',
        type: 'analyzer',
        content: {
            naming: {
                variableNaming: {
                    prefixWithType: true,
                    allowedPrefixes: ['l', 'g', 'p', 't'],
                    useHungarianNotation: true,
                    useCamelCase: true
                },
                procedureNaming: {
                    usePascalCase: true,
                    useDescriptiveNames: true,
                    minLength: 3
                },
                tableNaming: {
                    prefixWithNumber: true,
                    usePascalCase: true
                },
                pageNaming: {
                    prefixWithNumber: true,
                    usePascalCase: true,
                    includeSourceTableName: true
                }
            },
            complexity: {
                maxProcedureLength: {
                    enabled: true,
                    maxLines: 100
                },
                maxNestedBlocks: {
                    enabled: true,
                    maxLevel: 3
                },
                maxParameters: {
                    enabled: true,
                    maxCount: 5
                },
                cyclomaticComplexity: {
                    enabled: true,
                    maxValue: 10
                }
            },
            patterns: {
                requireRegions: {
                    enabled: true,
                    requiredRegions: ['Variables', 'Processing', 'Helper Functions']
                },
                enforceErrorHandling: {
                    enabled: true,
                    requireTryFunctionHandling: true
                },
                documentationRequirements: {
                    requireProcedureDocumentation: true,
                    requireTableDocumentation: true,
                    requirePageDocumentation: true,
                    requireReportDocumentation: true
                },
                databaseAccess: {
                    preferFindSet: true,
                    avoidRecordRepeatedly: true,
                    useWhereFilters: true
                }
            }
        },
        version: '1.0.0'
    },

    // Cursor-specific editor behavior for AL
    cursorBehavior: {
        id: 'al-cursor-behavior',
        name: 'AL Cursor Editor Behavior',
        description: 'Settings for cursor behavior when editing AL code',
        type: 'cursor',
        content: {
            autoCompletion: {
                enabled: true,
                suggestVariables: true,
                suggestFields: true,
                suggestFunctions: true,
                suggestKeywords: true,
                suggestSnippets: true,
                triggerCharacters: ['.', ':', '"', '(', ',']
            },
            codeActions: {
                createVariable: true,
                createProcedure: true,
                extractProcedure: true,
                addRegion: true,
                sortVariables: true,
                organizeUsingStatements: true
            },
            snippets: {
                enabled: true,
                triggers: {
                    'tproc': 'procedure ${1:ProcedureName}(${2:Parameters})\nbegin\n    ${0}\nend;',
                    'tif': 'if ${1:Condition} then begin\n    ${0}\nend;',
                    'tfor': 'for ${1:Variable} := ${2:StartValue} to ${3:EndValue} do begin\n    ${0}\nend;',
                    'trep': 'repeat\n    ${0}\nuntil ${1:Condition};',
                    'tcase': 'case ${1:Expression} of\n    ${2:Value}: begin\n        ${0}\n    end;\nend;'
                }
            },
            navigationHelpers: {
                gotoDefinition: true,
                findReferences: true,
                codeOutline: true,
                quickNavigation: true
            },
            diagnostics: {
                showInEditor: true,
                underlineErrors: true,
                showErrorsInStatusBar: true,
                provideCodeActions: true
            }
        },
        version: '1.0.0'
    }
};

module.exports = defaultRules; 