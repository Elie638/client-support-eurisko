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
        .select('title categories status');
    return({totalItems, complaints});
}