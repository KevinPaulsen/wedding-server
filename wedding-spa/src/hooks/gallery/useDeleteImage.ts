// hooks/gallery/useDeleteImage.ts
import {useApi} from '../useApi';
import {deleteImageRequest} from "../../services/ApiService";

export function useDeleteImage() {
  // T = null, A = [string]
  return useApi<null, [string]>(deleteImageRequest);
}
