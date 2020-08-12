"use strict";
const User = require('../models/user');
const Record = require('../models/record');
const Subrecord = require('../models/subrecord');
const Roomstate = require('../models/roomstate')
const { Op } = require("sequelize");

async function saveUser(userObject) {
    console.log("************************************");
    console.log("Request Save User Object in Database Api: ");
    console.log(userObject);
    try {
        await User.create({
            username: userObject.username,
            email: userObject.email
        });
    } catch (err) {
        console.log(err);
    }

}
module.exports.saveUser = saveUser;

async function saveRecord(recordObject) {
    console.log("************************************");
    console.log("Request Save Record in Database Api: ");
    console.log(recordObject);
    try {
        let savedRecordObject = await Record.create({
            uuid: recordObject.uuid,
            userId: recordObject.userId,
            converted: recordObject.converted,
            meeting_id: recordObject.meeting_id,
            startTime: recordObject.startTime,
            endTime: recordObject.endTime
        });

        return savedRecordObject;
    } catch (error) {
        console.error(error);
    }
}
module.exports.saveRecord = saveRecord;

async function saveSubrecord(subrecordObject) {
    console.log("************************************");
    console.log("Request Sub Record Piece in Database Api: ");
    console.log(subrecordObject);
    try {
        let savedSubrecordObject = await Subrecord.create({
            uuid: subrecordObject.uuid,
            userId: subrecordObject.userId,
            converted: subrecordObject.converted,
            record_id: subrecordObject.record_id,
            startTime: subrecordObject.startTime,
            endTime: subrecordObject.endTime,
            duration: subrecordObject.duration,
            transcription: subrecordObject.transcription,
            order: subrecordObject.order,
            meeting_id: subrecordObject.meeting_id
        });

        return savedSubrecordObject.dataValues;

    } catch (error) {
        console.error(error);
    }
}
module.exports.saveSubrecord = saveSubrecord;


async function updateObjectProperty(tablename, id, property, value) {
    console.log("************************************");
    console.log("Request Update Object in Database Api: ");
    console.log('TABLENAME')
    console.log(tablename)
    console.log('ID')
    console.log(id)
    console.log('PROPERTY')
    console.log(property)
    console.log('VALUE')
    console.log(value)
    let uuidInput = id.toString()
    try {
        let query = null;

        switch (tablename) {
            case 'Subrecord':
                query = await Subrecord.findOne({ where: { uuid: uuidInput } })
                break;
            case 'Record':
                query = await Record.findOne({ where: { uuid: uuidInput } })
                break;
            case 'Roomstate':
                query = await Roomstate.findOne({ where: { meeting_id: uuidInput } })
                break;
            default:
                query = null;
                break;
        }
        console.log('QUERY RESULT');

        if (query && query != null) {
            await query.update({ [property]: value })
        }

        return true;
    } catch (error) {
        console.error(error);
    }
}
module.exports.updateObjectProperty = updateObjectProperty;


async function getAllRecords() {
    console.log("************************************");
    console.log("Get All Records in Database Api: ");
    try {
        let records = await Record.findAll({
            attributes: ['id', 'uuid', 'converted', 'createdAt', 'updatedAt', 'meeting_id']
        });

        let finalList = [];
        records.forEach((resultSetItem) => {
            let current_item = resultSetItem.get({
                plain: true
            });
            finalList.push(current_item)
        });
        return finalList;
    } catch (error) {
        console.error(error);
    }
}
module.exports.getAllRecords = getAllRecords;


async function getRecordsByMeetingId(meetingId) {
    console.log("************************************");
    console.log("Get All Records in Database Api: ");
    try {
        let records = await Record.findAll({
            where: {
                meeting_id: meetingId

            },
            order: [
                ['createdAt', 'DESC'],
            ],
        });

        let finalList = [];
        records.forEach((resultSetItem) => {
            let current_item = resultSetItem.get({
                plain: true
            });
            finalList.push(current_item)
        });
        return finalList;
    } catch (error) {
        console.error(error);
    }
}
module.exports.getRecordsByMeetingId = getRecordsByMeetingId;


async function getRecord(uuid) {
    console.log("************************************");
    console.log("Get Record in Database Api: ");
    console.log(uuid)
    try {
        let record = await Record.findOne({ where: { uuid: uuid } });
        if (record && record != null) {
            record = record.get({
                plain: true
            });
            console.log('RECORD RESULT IN DATABASE....')
            return { record: record, exist: true }
        } else {
            return { exist: false };
        }


    } catch (error) {
        console.error(error);
    }
}
module.exports.getRecord = getRecord;


async function getSubrecord(uuid) {
    console.log("************************************");
    console.log("Get Sub Record in Database Api: ");
    console.log(uuid)
    try {
        let subrecord = await Subrecord.findOne({ where: { uuid: uuid } });
        if (subrecord && subrecord != null) {
            subrecord = subrecord.get({
                plain: true
            });
            console.log('SUB RECORD RESULT IN DATABASE....')
            return subrecord
        } else {
            return null;
        }

    } catch (error) {
        console.error(error);
    }
}
module.exports.getSubrecord = getSubrecord;

async function getRecordingFlag(meetingId) {
    console.log("************************************");
    console.log("getRecordingFlag in Database Api: ");
    console.log(meetingId)
    try {
        let roomstate = await Roomstate.findOne({ where: { meeting_id: meetingId } });
        if (roomstate && roomstate != null) {
            roomstate = roomstate.get({
                plain: true
            });
            console.log('RECORDING FLAG RESULT IN DATABASE....')
            return roomstate
        } else {
            return null;
        }

    } catch (error) {
        console.error(error);
    }
}
module.exports.getRecordingFlag = getRecordingFlag;

async function getLanguageSelectedByMeetingId(meetingId) {
    console.log("************************************");
    console.log("getLanguageSelectedByMeetingId in Database Api: ");
    console.log(meetingId)
    try {
        let roomstate = await Roomstate.findOne({ where: { meeting_id: meetingId } });
        if (roomstate && roomstate != null) {
            roomstate = roomstate.get({
                plain: true
            });
            console.log('RECORDING FLAG RESULT IN DATABASE....')
            return roomstate
        } else {
            return null;
        }

    } catch (error) {
        console.error(error);
    }
}
module.exports.getLanguageSelectedByMeetingId = getLanguageSelectedByMeetingId;


async function getLastRecord(meetingId) {
    console.log("************************************");
    console.log("Get Last Record in Database Api: ");
    try {
        let record = await Record.findAll({
            limit: 1,
            where: {
                meeting_id: meetingId
            },
            order: [['createdAt', 'DESC']],
            plain: true
        });
        console.log('LAST RECORD RESULT')
        console.log(record)

        return record;

    } catch (error) {
        console.error(error);
    }
}
module.exports.getLastRecord = getLastRecord;

async function deleteRecord(uuid) {
    console.log("************************************");
    console.log("Delete Record in Database Api: ");
    console.log(uuid)
    try {
        await Record.destroy({
            where: {
                uuid: uuid
            }
        });
        console.log('RECORD DELETED>>>>>>>')
        return true;
    } catch (error) {
        console.error(error);
    }
}
module.exports.deleteRecord = deleteRecord;

async function saveRecordFlag(meetingId, flag) {
    console.log("************************************");
    console.log("Request SaveRecordFlag in Database Api: ");
    console.log(meetingId)
    let savedRecordingFlagObject;
    try {
        savedRecordingFlagObject = await Roomstate.findAll({
            where: {
                meeting_id: meetingId,
            },
            // plain: true
        });

        console.log('ROOM STATE OBJECT!!!!!!!!!!!11>>>>>>>>>>>>>>>>>.')
        console.log(savedRecordingFlagObject)
        if (savedRecordingFlagObject!=null &&savedRecordingFlagObject.length>0) {
            console.log('PASSED CONTITION!!!!!!!!!!!11>>>>>>>>>>>>>>>>>.')

            console.log(typeof savedRecordingFlagObject)
            await updateObjectProperty('Roomstate', meetingId, 'isRecording', flag);
            savedRecordingFlagObject = savedRecordingFlagObject[0]
        } else {
            savedRecordingFlagObject = await Roomstate.create({
                meeting_id: meetingId,
                isRecording: flag,
            });
        }
     
        return savedRecordingFlagObject;
    } catch (error) {
        console.error(error);
    }
}
module.exports.saveRecordFlag = saveRecordFlag;


async function getRoomState(meetingId) {
    console.log("************************************");
    console.log("Request SaveRecordFlag in Database Api: ");
    console.log(meetingId)
    let roomstateObject;
    try {
        roomstateObject = await Roomstate.findAll({
            where: {
                meeting_id: meetingId,
            },
            // plain: true
        });
        if (roomstateObject && roomstateObject.length > 0) {
            roomstateObject = savedRecordingFlagObject[0]
        } else {
            roomstateObject = await Roomstate.create({
                meeting_id: meetingId,
                isRecording: flag,
            });
        }

        return roomstateObject;
    } catch (error) {
        console.error(error);
    }
}
module.exports.getRoomState = getRoomState;

async function deleteSubrecord(uuid) {
    console.log("************************************");
    console.log("Delete Sub Record in Database Api: ");
    console.log(uuid)
    try {
        await Subrecord.destroy({
            where: {
                uuid: uuid
            }
        });
        console.log('SUB RECORD DELETED>>>>>>>')

        return true;

    } catch (error) {
        console.error(error);
    }
}
module.exports.deleteSubrecord = deleteSubrecord;

async function getAllSubrecordsByRecordId(uuid) {
    console.log("************************************");
    console.log("getAllSubrecordsByRecordId in Database Api: ");
    try {
        console.log('QUERY ID')
        console.log(uuid)
        let subrecord = await Subrecord.findAll({
            where: {
                record_id: uuid,

            },
            order: [
                ['order', 'ASC'],
            ],
        });
        console.log('SUB RECORDS!!!!')
        let finalList = [];
        subrecord.forEach((resultSetItem) => {
            let current_item = resultSetItem.get({
                plain: true
            });
            finalList.push(current_item)
        });
        console.log('IT PASSED~!!')
        return finalList;
    } catch (error) {
        console.error(error);
    }

}
module.exports.getAllSubrecordsByRecordId = getAllSubrecordsByRecordId;

//this is assuming that was continuous recording pressing the button 
async function getAllRecordsByMeetingId(meetingId) {
    console.log("************************************");
    console.log("getAllRecordsByMeetingId in Database Api: ");
    try {
        console.log('QUERY ID')
        console.log(meetingId)
        let records = await Record.findAll({
            where: {
                meeting_id: meetingId,

            },
            order: [
                ['createdAt', 'ASC'],
            ],
        });
        console.log('RECORDS!!!!')
        let finalList = [];
        records.forEach((resultSetItem) => {
            let current_item = resultSetItem.get({
                plain: true
            });
            finalList.push(current_item)
        });
        console.log('IT PASSED~!!')
        return finalList;
    } catch (error) {
        console.error(error);
    }

}
module.exports.getAllRecordsByMeetingId = getAllRecordsByMeetingId;

async function getRecordListByMeetingId(meetingId, pullDate) {
    console.log("************************************");
    console.log("getRecordListByMeetingId in Database Api: ");
    try {
        console.log(meetingId)
        console.log(pullDate)
        var dateQuery = new Date(pullDate);

        let querylist
        if (pullDate) {
            console.log('GREATE THAN')
            querylist = await Record.findAll({
                where: {
                    meeting_id: meetingId,
                    createdAt: {
                        [Op.gt]: dateQuery
                    },
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
            });
        } else {
            querylist = await Record.findAll({
                where: {
                    meeting_id: meetingId,
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
            });
        }

        let finalList = [];
        querylist.forEach((resultSetItem) => {
            let current_item = resultSetItem.get({
                plain: true
            });
            finalList.push(current_item)
        });
        return finalList;
    } catch (error) {
        console.error(error);
    }
}
module.exports.getRecordListByMeetingId = getRecordListByMeetingId;
