from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token

def test_password_hashing():
    raw_password = "SecretPassword123!"
    hashed = get_password_hash(raw_password)
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_encode_decode():
    user_id = 42
    token = create_access_token(subject=user_id)
    assert isinstance(token, str)
    decoded_sub = decode_access_token(token)
    assert decoded_sub == str(user_id)
