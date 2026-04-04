import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem:     { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  language: { type: String, enum: [ 'cpp', 'python', 'java',  'c', 'javascript'], required: true },
  code:        { type: String, required: true },
  verdict:     { type: String, enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error', 'Error'], required: true },
  runtime:     { type: String, default: 'N/A' },
  memory:      { type: String, default: 'N/A' },
  testsPassed: { type: Number, default: 0 },
  testsTotal:  { type: Number, default: 0 },
  output:      { type: String, default: '' },
  stderr:      { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Submission', SubmissionSchema);
