import { LeadsModel } from "../Models/LeadsModel.js"
import { UsersModel } from "../Models/UsersModel.js"

const Create = async (req, res) => {
    try {
        const {
            userId,
            leadDesignation,
            leadInterestedPropertyId,
            leadStatus,
            referanceFrom,
            followUpStatus,
            referredByUserId,
            referredByUserFirstName,
            referredByUserLastName,
            referredByUserEmail,
            referredByUserPhoneNumber,
            referredByUserDesignation,
            assignedByUserId,
            assignedToUserId,
            leadAltEmail,
            leadAltPhoneNumber,
            leadLandLineNumber,
            leadWebsite,
            note
        } = req.body

        if (!userId || !leadInterestedPropertyId || !leadStatus || !followUpStatus) {
            return res.status(400).json({
                message: 'Required fields are missing',
                data: req.body
            })
        }

        const newLead = {
            ...req.body,
            createdByUserId: req.user.id,
            updatedByUserId: req.user.id,
            published: true
        }

        const lead = await LeadsModel.create(newLead)
        return res.status(200).json({
            message: 'Lead created successfully',
            data: lead
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const GetAllLeads = async (req, res) => {
    try {
        const leads = await LeadsModel.find({ published: true })
            .populate('userId')
            .populate('leadStatus')
            .populate('referanceFrom')
            .populate('followUpStatus')
            .populate('referredByUserId')
            .populate('assignedByUserId')
            .populate('assignedToUserId')

        return res.status(200).json({
            message: 'All leads',
            count: leads.length,
            data: leads
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const GetAllNotPublishedLeads = async (req, res) => {
    try {
        const leads = await LeadsModel.find({ published: false })
            .populate('userId')
            .populate('leadStatus')
            .populate('referanceFrom')
            .populate('followUpStatus')
            .populate('referredByUserId')
            .populate('assignedByUserId')
            .populate('assignedToUserId')

        return res.status(200).json({
            message: 'All not published leads',
            count: leads.length,
            data: leads
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const GetAllLeadsWithParams = async (req, res) => {
    try {
        const {
            userId = null,
            leadStatus = null,
            referanceFrom = null,
            followUpStatus = null,
            assignedToUserId = null,
            published = null
        } = req.body

        let filter = {}

        if (userId !== null) {
            filter.userId = userId
        }
        if (leadStatus !== null) {
            filter.leadStatus = leadStatus
        }
        if (referanceFrom !== null) {
            filter.referanceFrom = referanceFrom
        }
        if (followUpStatus !== null) {
            filter.followUpStatus = followUpStatus
        }
        if (assignedToUserId !== null) {
            filter.assignedToUserId = assignedToUserId
        }
        if (published !== null) {
            filter.published = published
        }

        const leads = await LeadsModel.find(filter)
            .populate('userId')
            .populate('leadStatus')
            .populate('referanceFrom')
            .populate('followUpStatus')
            .populate('referredByUserId')
            .populate('assignedByUserId')
            .populate('assignedToUserId')

        return res.status(200).json({
            message: 'Filtered leads',
            count: leads.length,
            data: leads
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const GetLeadById = async (req, res) => {
    try {
        const { id } = req.params
        const lead = await LeadsModel.findById(id)
            .populate('userId')
            .populate('leadStatus')
            .populate('referanceFrom')
            .populate('followUpStatus')
            .populate('referredByUserId')
            .populate('assignedByUserId')
            .populate('assignedToUserId')

        if (!lead) {
            return res.status(404).json({
                message: 'Lead not found',
                data: null
            })
        }

        return res.status(200).json({
            message: 'Lead found',
            data: lead
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const Edit = async (req, res) => {
    try {
        const { id } = req.params
        const lead = await LeadsModel.findById(id)

        if (!lead) {
            return res.status(404).json({
                message: 'Lead not found'
            })
        }

        const updatedLead = {
            ...req.body,
            createdByUserId: lead.createdByUserId,
            updatedByUserId: req.user.id
        }

        const result = await LeadsModel.findByIdAndUpdate(id, updatedLead)
        if (!result) {
            return res.status(404).json({
                message: 'Lead not found'
            })
        }

        return res.status(201).json({
            message: 'Lead updated successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

const DeleteById = async (req, res) => {
    try {
        const { id } = req.params
        const lead = await LeadsModel.findById(id)

        if (!lead) {
            return res.status(404).json({
                message: 'Lead not found',
                data: null
            })
        }

        lead.updatedByUserId = req.user.id
        lead.published = false

        const result = await LeadsModel.findByIdAndUpdate(id, lead)
        if (!result) {
            return res.status(404).json({
                message: 'Lead not found'
            })
        }

        return res.status(201).json({
            message: 'Lead deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

export {
    Create,
    GetAllLeads,
    GetAllNotPublishedLeads,
    GetAllLeadsWithParams,
    GetLeadById,
    Edit,
    DeleteById
}