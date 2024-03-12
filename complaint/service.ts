import Complaint from './model';

export const postComplaint = async (req: any) => {
    const complaint = new Complaint(req);
    await complaint.save();
    return complaint;
}

export const getUserComplaints = async (req: any) => {
    const userId = req.userId;
    const page = req.page;
    const itemPerPage = req.itemPerPage;
    const totalItems = await Complaint.find({userId: userId}).countDocuments();
    const complaints = await Complaint.find({userId: userId})
        .skip((page-1) * itemPerPage)
        .limit(itemPerPage)
        .select('title categoriesId status');
    return({totalItems, complaints});
}

export const getComplaintDetails = async (req: any) => {
    const userId = req.userId;
    const complaintId = req.complaintId;
    const complaint = await Complaint.findOne({_id: complaintId, userId: userId});
    return complaint;
}

export const deleteComplaint = async (req: any) => {
    const userId = req.userId;
    const complaintId = req.complaintId;
    await Complaint.findOneAndDelete({_id: complaintId, userId: userId});
}


export const filterSearchComplaints = async (req: any) => {
    const { page, itemPerPage, status, userId } = req;
    const query: any = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    const totalItems = await Complaint.find(query).countDocuments();
    const complaints = await Complaint.find(query)
        .sort({ createdAt: 1 })
        .skip((page-1) * itemPerPage)
        .limit(itemPerPage)
    return({totalItems, complaints});
}

export const updateStatus = async (req: any) => {
    const complaintId = req.complaintId;
    const status = req.status;
    const result = await Complaint.findByIdAndUpdate(complaintId, {status: status}, {new: true});
    return result;
}