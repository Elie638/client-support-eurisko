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