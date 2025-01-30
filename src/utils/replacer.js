export const replacer = ({ strToReplace, dataSource }) => {
    const replaceUsingSpecifier = (name, specifier) => {
        let specifierValues = {};
        let playerSesi = {};
        let i, macroStartPosition, macroEndPosition;

        if (specifier) {
            const tmpArrayOfSpecifers = specifier.split('&');
            tmpArrayOfSpecifers.map((specifier) => {
                //crutch for variant markets (sf = variant=sr:point_range:6+... etc)
                if (specifier.includes('variant=')) {
                    specifier =
                        specifier.substring(
                            specifier.indexOf(':') + 1,
                            specifier.lastIndexOf(':')
                        ) +
                        '=' +
                        specifier.substring(specifier.lastIndexOf(':') + 1);
                }
                if (specifier.includes('sr:competitor')) {
                    let specifierKeyValue = specifier.split('=')[1];
                    let specifierTemp = specifierKeyValue.split(':');
                    specifierKeyValue = specifierTemp[specifierTemp.length - 1];

                    if (
                        dataSource.activeMatch?.competitor1.id.toString() ===
                        specifierKeyValue
                    ) {
                        specifier =
                            'server=' + dataSource.activeMatch?.competitor1.name;
                    }
                    if (
                        dataSource.activeMatch?.competitor2.id.toString() ===
                        specifierKeyValue
                    ) {
                        specifier =
                            'server=' + dataSource.activeMatch?.competitor2.name;
                    }
                }
                if (specifier.includes('player') && dataSource?.activeMatch.playersSesi) {
                    let specifierKeyValue = specifier.split('=')[1];
                    if (specifierKeyValue.includes('sr:player')) {
                        let specifierTemp = specifierKeyValue.split(':');
                        specifierKeyValue =
                            specifierTemp[specifierTemp.length - 1];
                    }

                    playerSesi = dataSource?.activeMatch.playersSesi[specifierKeyValue];
                }
                let specifierKeyValue = specifier.split('=');

                if (specifierKeyValue[1].includes('sr:player')) {
                    specifierValues[specifierKeyValue[0]] = playerSesi;
                } else {
                    specifierValues[specifierKeyValue[0]] = specifierKeyValue[1];
                }
            });
        }

        do {
            macroStartPosition = name.indexOf('{', i);
            macroEndPosition = name.indexOf('}', i);
            if (macroStartPosition > -1 && macroEndPosition > -1) {
                let macroName = name.substring(
                    macroStartPosition + 1,
                    macroEndPosition
                );
                let operation, macro;
                if (['-', '+'].includes(macroName[0])) {
                    operation = macroName[0];
                }
                if (['$', '!', '%', '-', '+'].includes(macroName[0])) {
                    macroName = macroName.substring(1);
                }
                macro = {
                    name: macroName,
                    start: macroStartPosition,
                    end: macroEndPosition + 1,
                    operation: operation,
                };

                if (specifierValues[macro.name]) {
                    if (macro.operation === '-') {
                        name = name.replaceBetween(
                            macro.start,
                            macro.end,
                            0 - parseFloat(specifierValues[macro.name])
                        );
                    } else if (macro.operation === '+') {
                        name = name.replaceBetween(
                            macro.start,
                            macro.end,
                            parseFloat(specifierValues[macro.name])
                        );
                    } else {
                        name = name.replaceBetween(
                            macro.start,
                            macro.end,
                            specifierValues[macro.name]
                        );
                    }
                } else if (/competitor[1|2]/i.test(macro.name)) {
                    name = name.replaceBetween(
                        macro.start,
                        macro.end,
                        dataSource.activeMatch?.competitorName(
                            macro.name.toLowerCase()
                        )
                    );
                } else if (/competitor/i.test(macro.name) && specifierValues?.server) {
                    name = name.replaceBetween(
                        macro.start,
                        macro.end,
                        specifierValues.server
                    );
                } else if (/player/.test(macro.name) && playerSesi) {
                    name = name.replaceBetween(
                        macro.start,
                        macro.end,
                        playerSesi
                    );
                } else if (/inningnr\+/.test(macro.name)) {
                    const inning = macro.name.split('+');
                    name = name.replaceBetween(
                        macro.start,
                        macro.end,
                        (
                            parseInt(specifierValues.inningnr) +
                            parseInt(inning[1])
                        ).toString()
                    );
                } else {
                    name = name.replaceBetween(
                        macro.start,
                        macro.end,
                        '%' + macro.name + '%'
                    );
                }
            }
        } while (macroStartPosition !== -1 || macroEndPosition !== -1);

        return name;
    };

    let result = strToReplace;
    if (strToReplace?.includes('{')) {
        result = replaceUsingSpecifier(strToReplace, dataSource.specifier);
    }
    return result;
};