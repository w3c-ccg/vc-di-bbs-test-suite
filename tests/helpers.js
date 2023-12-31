/*!
 * Copyright 2023 Digital Bazaar, Inc. All Rights Reserved
 */
import {klona} from 'klona';
import {v4 as uuidv4} from 'uuid';

// Javascript's default ISO timestamp contains milliseconds.
// This lops off the MS part of the UTC RFC3339 TimeStamp and replaces
// it with a terminal Z.
export const ISOTimeStamp = ({date = new Date()} = {}) => {
  return date.toISOString().replace(/\.\d+Z$/, 'Z');
};

export const createInitialVc = async ({issuer, vc}) => {
  const {settings: {id: issuerId, options}} = issuer;
  const credential = klona(vc);
  credential.id = `urn:uuid:${uuidv4()}`;
  credential.issuer = issuerId;
  credential.issuanceDate = ISOTimeStamp();
  const body = {credential, options};
  const {data} = await issuer.post({json: body});
  return data;
};

export const createDisclosedVc = async ({
  selectivePointers = [], signedCredential, vcHolder
}) => {
  const {data} = await vcHolder.post({
    json: {
      options: {
        selectivePointers
      },
      verifiableCredential: signedCredential
    }
  });
  return {disclosedCredential: data};
};
