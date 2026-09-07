import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContact } from '../src/components/contact/validation';
const valid={name:'Alex',email:'alex@example.com',company:'',message:'I would like to discuss a website.'};
test('valid inquiry is accepted and fields trimmed',()=>{ const result=validateContact({...valid,name:' Alex '}); assert.ok(result.ok); if(result.ok) assert.equal(result.data.name,'Alex'); });
test('rejects malformed input, invalid email, headers and oversized messages',()=>{
  for(const value of [null,{}, {...valid,email:'bad'}, {...valid,name:'Alex\r\nBcc: hello'}, {...valid,message:'x'.repeat(5001)}]) assert.equal(validateContact(value).ok,false);
});
