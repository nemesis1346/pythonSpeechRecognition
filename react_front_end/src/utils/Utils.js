export const parseResponse = (response) => {

    let body = JSON.parse(response);
    if (body.status == '200') {
        return body.data;
    } else {
        return body.message;
    }
}
//  MORE EFFICIENT, BUT LESS FUN
/**
 * @description Remove duplicates from an array of objects in javascript
 * @param arr - Array of objects
 * @param prop - Property of each object to compare
 * @returns {Array}
 */
export const removeDuplicatesProp = (arr, prop) => {
    let obj = {};
    return Object.keys(arr.reduce((prev, next) => {
        if (!obj[next[prop]]) obj[next[prop]] = next;
        return obj;
    }, obj)).map((i) => obj[i]);
}

export const parseParamValue = (paramName) => {
    let url = window.location.search.substring(1); //get rid of "?" in querystring
    let qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] === paramName)
            //    console.log(pArr[1]);
            return pArr[1]; //return value
    }
}

export const parseContent = (content) => {
    let entireContent = content;
    let finalResult = [];

    //Processing for the entire sentence
    for (let index = 0; index <= entireContent.length; index++) {
        for (let j = index; j <= entireContent.length; j++) {
            const currentResult = entireContent.slice(index, j).trim();
            if (currentResult) {
                finalResult.push(currentResult.toLowerCase());
            }
        }
    }
    finalResult = this.removeDuplicates(finalResult);
    return finalResult;
}


export const clearListFromEmptyStrings = (inputList, prop) => {
    let finalResult = [];
    for (let index = 0; index < inputList.length; index++) {
        const currentItem = inputList[index][prop]
        if (currentItem != "undefined") {
            if (currentItem.replace(/\s/g, '').length) {
                finalResult.push(inputList[index])
            }
        }
    }
    return finalResult;
}
export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* Define functin to find and replace specified term with replacement string */
export const replaceAll = (str, term, replacement) => {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}
export const replaceStringByStringList = (inputList, prop, value, newValue) => {
    let finalResult = [];
    for (let index = 0; index < inputList.length; index++) {
        if (inputList[index][prop].indexOf(value) !== -1) {
            inputList[index][prop] = replaceAll(inputList[index][prop], value, newValue)
            finalResult.push(inputList[index]);
        } else {
            finalResult.push(inputList[index]);
        }
    }
    return finalResult;
}


/**
 * @description Remove duplicates
 */
export const removeDuplicates = (arr) => {
    let unique_array = []
    for (let i = 0; i < arr.length; i++) {
        if (unique_array.indexOf(arr[i]) == -1) {
            unique_array.push(arr[i])
        }
    }
    return unique_array
}

export const removeDuplicates2 = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

export const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

export const findObjectByKey = (array, key, value) => {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}