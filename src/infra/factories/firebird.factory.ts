import { FirebirdBlobService } from "../services/firebird.blob.service";
import { FirebirdService } from "../services/firebird.service";

export const firebirdFactory = () => new FirebirdService();
export const firebirdBlobFactory = () => new FirebirdBlobService();
