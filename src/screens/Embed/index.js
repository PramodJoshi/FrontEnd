import React from 'react';
import { uurl } from 'utils/use-url'
import { api } from 'utils'
import { CTPlayer } from 'components/CTPlayer';

export function Embed() {
    const { id } = uurl.useSearch();

    const media = async (mediaId) => {
        try {
            const { data } = await api.getMediaById(mediaId);
            return api.parseMedia(data);
        } catch (error) {
            return api.parseMedia();
        }
    }

    return (
      <CTPlayer
            // mediaId="c9a54a76-9cf0-4ec2-ab2f-89d496326562"
            // media={media}
        width={540}
      />

    )
}