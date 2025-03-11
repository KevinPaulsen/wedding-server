// hooks/gallery/useUploadPhoto.ts
import {useApi} from '../useApi';
import {uploadPhoto} from '../../services/ApiService';
import {ImageMetadata} from '../../types/gallery';

export function useUploadPhoto() {
  // T = ImageMetadata, A = [File]
  return useApi<ImageMetadata, [File]>(uploadPhoto);
}
