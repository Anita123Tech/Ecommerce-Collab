/* ═══ EverStyle Cart & Checkout Page Logic ═══ */
(function(){
    var F=function(n){return'PKR '+Number(n).toLocaleString('en-PK')};
    var catNames={bridal:'Bridal Collection',daily:'Daily Wear',summer:'Summer Collection',kids:'Kids Collection',sale:'Sale'};

    /* ── View Switch ── */
    function go(){
        var h=location.hash.replace('#',''),cv=document.getElementById('cart-view'),co=document.getElementById('checkout-view');
        if(h==='checkout-view'){cv.style.display='none';co.style.display='block';renderCO();}
        else{cv.style.display='block';co.style.display='none';renderCart();}
        scrollTo({top:0,behavior:'smooth'});
    }
    addEventListener('hashchange',go);

    /* ── Ship Bar ── */
    function shipBar(){
        var s=Cart.getSubtotal(),t=4999,p=Math.min(100,s/t*100);
        var f=document.getElementById('ship-fill'),tx=document.getElementById('ship-text');
        if(!f)return;f.style.width=p+'%';
        if(s>=t){tx.innerHTML='<strong>Free shipping unlocked!</strong>';}
        else{tx.innerHTML='Add <strong>'+F(t-s)+'</strong> more for free shipping';}
    }

    /* ═══ CART ═══ */
    function renderCart(){
        var items=Cart.items,emp=document.getElementById('empty'),wrap=document.getElementById('cart-content'),cnt=document.getElementById('cart-count'),list=document.getElementById('cart-items');
        if(!items||!items.length){emp.style.display='block';wrap.style.display='none';cnt.textContent='';return;}
        emp.style.display='none';wrap.style.display='grid';
        var tq=Cart.getCount();cnt.textContent='('+tq+' item'+(tq!==1?'s':'')+')';

        var groups={};
        items.forEach(function(it){
            var c=it.category||'daily';
            if(!groups[c])groups[c]=[];
            groups[c].push(it);
        });

        var html='';
        Object.keys(groups).forEach(function(cat){
            var g=groups[cat];
            html+='<div class="cart-card">';
            html+='<div class="cart-card-header"><i class="fas fa-store"></i><span>EverStyle</span><span class="cat-tag">'+(catNames[cat]||cat)+'</span></div>';
            g.forEach(function(it){
                var cs=it.color?'background:'+it.color:'';
                html+='<div class="cart-row" data-key="'+it.key+'">';
                html+='<div class="cart-check"><input type="checkbox" checked></div>';
                html+='<div class="cart-img"><img src="'+it.image+'" alt="'+it.name+'" loading="lazy"></div>';
                html+='<div class="cart-info"><h3>'+it.name+'</h3><p class="fabric">'+it.fabric+'</p>';
                if(it.color) html+='<span class="color-row"><span class="color-dot" style="'+cs+'"></span>Selected</span>';
                html+='</div>';
                html+='<div class="cart-price-cell"><span class="curr">'+F(it.price)+'</span>';
                if(it.originalPrice) html+='<span class="orig">'+F(it.originalPrice)+'</span>';
                html+='</div>';
                html+='<div class="cart-qty"><button class="qm" data-k="'+it.key+'">&#8722;</button><span class="val">'+it.qty+'</span><button class="qp" data-k="'+it.key+'">+</button></div>';
                html+='<div class="cart-subtotal"><span class="amount">'+F(it.price*it.qty)+'</span></div>';
                html+='<div class="cart-del"><button class="rdel" data-k="'+it.key+'"><i class="fas fa-trash-alt"></i></button></div>';
                html+='</div>';
            });
            html+='</div>';
        });
        list.innerHTML=html;
        renderCartSum();
        shipBar();
    }

    function renderCartSum(){
        var s=Cart.getSubtotal(),sh=Cart.getShipping(),tx=Cart.getTax(),dc=Cart.getDiscount(),tot=Cart.getTotal(),pm=Cart.getPromo();
        var h='<div class="summary-head">Order Summary</div><div class="summary-body">';
        h+='<div class="summary-row"><span class="lbl">Subtotal ('+Cart.getCount()+' items)</span><span class="val">'+F(s)+'</span></div>';
        h+='<div class="summary-row '+(sh===0?'free':'')+'"><span class="lbl">Shipping</span><span class="val">'+(sh===0?'Free':F(sh))+'</span></div>';
        h+='<div class="summary-row"><span class="lbl">Tax (5%)</span><span class="val">'+F(tx)+'</span></div>';
        if(dc>0) h+='<div class="summary-row discount"><span class="lbl">Discount ('+pm+')</span><span class="val">-'+F(dc)+'</span></div>';
        h+='<div class="summary-divider"></div>';
        h+='<div class="summary-total"><span class="lbl">Total</span><span class="val">'+F(tot)+'</span></div>';

        h+='<div class="promo-box"><label>Promo Code</label>';
        if(pm){h+='<div class="promo-active"><span><i class="fas fa-tag"></i> '+pm+'</span><button class="promo-rm" id="prm-rm"><i class="fas fa-times"></i></button></div>';}
        else{h+='<div class="promo-row"><input type="text" id="prm-inp" placeholder="Enter code"><button id="prm-btn">Apply</button></div><div class="promo-msg" id="prm-msg"></div>';}
        h+='</div>';

        h+='<button class="btn-checkout" id="go-co"><i class="fas fa-lock"></i> Proceed to Checkout</button>';
        h+='<a href="index.html" class="btn-continue"><i class="fas fa-arrow-left"></i> Continue Shopping</a>';
        h+='<div class="trust-row"><div class="trust-col"><i class="fas fa-shield-alt"></i><span>Secure</span></div><div class="trust-col"><i class="fas fa-truck"></i><span>Free Ship</span></div><div class="trust-col"><i class="fas fa-undo"></i><span>14-Day Returns</span></div></div>';
        h+='</div>';

        document.getElementById('cart-summary').innerHTML=h;

        var gb=document.getElementById('go-co');if(gb) gb.onclick=function(){location.hash='#checkout-view';};
        var pb=document.getElementById('prm-btn');
        if(pb) pb.onclick=function(){
            var v=document.getElementById('prm-inp').value.trim(),m=document.getElementById('prm-msg');
            if(!v){m.textContent='Enter a code';m.className='promo-msg err';return;}
            if(Cart.applyPromo(v)){m.textContent='Discount applied!';m.className='promo-msg ok';setTimeout(renderCartSum,500);}
            else{m.textContent='Invalid. Try EVERSTYLE10, SUMMER26, or BRIDAL20';m.className='promo-msg err';}
        };
        var pr=document.getElementById('prm-rm');if(pr) pr.onclick=function(){Cart.removePromo();renderCartSum();};
    }

    /* Cart events */
    document.getElementById('cart-items').addEventListener('click',function(e){
        var t=e.target.closest('button');if(!t)return;var k=t.dataset.k;
        if(t.classList.contains('qm')){var it=Cart.items.find(function(i){return i.key===k;});if(it&&it.qty>1){Cart.updateQty(k,it.qty-1);renderCart();}}
        else if(t.classList.contains('qp')){var it=Cart.items.find(function(i){return i.key===k;});if(it&&it.qty<10){Cart.updateQty(k,it.qty+1);renderCart();}}
        else if(t.classList.contains('rdel')){Cart.remove(k);renderCart();}
    });

    /* ═══ CHECKOUT ═══ */
    function renderCO(){
        var items=Cart.items;if(!items||!items.length){location.hash='#cart-view';return;}
        var s=Cart.getSubtotal(),sh=Cart.getShipping(),tx=Cart.getTax(),dc=Cart.getDiscount(),pm=Cart.getPromo();
        var dv=document.querySelector('input[name="del"]:checked'),dm=dv?dv.value:'std';
        var df=dm==='exp'?500:sh,tot=s+df+tx-dc;

        var h='<div class="summary-head">Your Order</div><div class="summary-body">';
        items.forEach(function(it){
            h+='<div class="co-item"><div class="co-item-img"><img src="'+it.image+'" alt="'+it.name+'" loading="lazy"><span class="qb">'+it.qty+'</span></div>';
            h+='<div class="co-item-info"><h4>'+it.name+'</h4><span class="cf">'+it.fabric+'</span></div>';
            h+='<div class="co-item-price">'+F(it.price*it.qty)+'</div></div>';
        });
        h+='<div class="summary-divider"></div>';
        h+='<div class="summary-row"><span class="lbl">Subtotal</span><span class="val">'+F(s)+'</span></div>';
        h+='<div class="summary-row"><span class="lbl">Shipping</span><span class="val">'+(df===0?'Free':F(df))+'</span></div>';
        h+='<div class="summary-row"><span class="lbl">Tax (5%)</span><span class="val">'+F(tx)+'</span></div>';
        if(dc>0) h+='<div class="summary-row discount"><span class="lbl">Discount ('+pm+')</span><span class="val">-'+F(dc)+'</span></div>';
        h+='<div class="summary-divider"></div>';
        h+='<div class="summary-total"><span class="lbl">Total</span><span class="val">'+F(tot)+'</span></div>';
        h+='<div class="trust-row"><div class="trust-col"><i class="fas fa-lock"></i><span>SSL Encrypted</span></div><div class="trust-col"><i class="fas fa-shield-alt"></i><span>Buyer Protection</span></div><div class="trust-col"><i class="fas fa-headset"></i><span>24/7 Support</span></div></div>';
        h+='<button class="btn-place" id="place-btn"><i class="fas fa-lock"></i> Place Order — '+F(tot)+'</button>';
        h+='<a href="checkout&cart.html#cart-view" class="btn-continue" style="margin-top:8px"><i class="fas fa-arrow-left"></i> Back to Cart</a></div>';

        document.getElementById('co-summary').innerHTML=h;
        var dp=document.getElementById('del-price');if(dp) dp.textContent=sh===0?'Free':F(sh);

        document.getElementById('place-btn').addEventListener('click',function(){
            if(validate()){
                this.disabled=true;this.innerHTML='<i class="fas fa-spinner fa-spin"></i> Processing...';
                setTimeout(function(){
                    var id='ES-'+Date.now().toString(36).toUpperCase()+Math.random().toString(36).substr(2,4).toUpperCase();
                    document.getElementById('order-id').textContent=id;
                    document.getElementById('success-overlay').classList.add('show');
                    Cart.clear();
                },1800);
            }
        });
    }

    document.getElementById('del-opts').addEventListener('click',function(e){
        var o=e.target.closest('.del-opt');if(!o)return;
        document.querySelectorAll('.del-opt').forEach(function(x){x.classList.remove('sel');});
        o.classList.add('sel');o.querySelector('input').checked=true;renderCO();
    });
    document.getElementById('pay-grid').addEventListener('click',function(e){
        var m=e.target.closest('.pay-opt');if(!m)return;
        document.querySelectorAll('.pay-opt').forEach(function(x){x.classList.remove('sel');});
        m.classList.add('sel');m.querySelector('input').checked=true;
        document.getElementById('card-fields').style.display=m.dataset.m==='card'?'block':'none';
    });

    function validate(){
        var ok=true;
        [{id:'co-email',e:'err-email'},{id:'co-phone',e:'err-phone'},{id:'co-fn',e:'err-fn'},{id:'co-ln',e:'err-ln'},{id:'co-addr',e:'err-addr'},{id:'co-city',e:'err-city'},{id:'co-post',e:'err-post'}].forEach(function(f){
            var inp=document.getElementById(f.id),er=document.getElementById(f.e),v=inp.value.trim();
            inp.classList.remove('bad');er.textContent='';
            if(!v){inp.classList.add('bad');er.textContent='Required';ok=false;}
            else if(f.id==='co-email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){inp.classList.add('bad');er.textContent='Invalid email';ok=false;}
        });
        var pv=document.getElementById('co-prov'),ep=document.getElementById('err-prov');
        if(!pv.value){pv.classList.add('bad');ep.textContent='Required';ok=false;}
        return ok;
    }

    document.getElementById('modal-close').addEventListener('click',function(e){e.preventDefault();document.getElementById('success-overlay').classList.remove('show');location.hash='#cart-view';});

    addEventListener('load',function(){var o=document.getElementById('loading-overlay');if(o)o.classList.add('hidden');});

    var nl=document.getElementById('newsletter-form');
    if(nl) nl.addEventListener('submit',function(e){e.preventDefault();var b=this.querySelector('.btn');b.textContent='Subscribed!';setTimeout(function(){b.textContent='Subscribe';},2000);this.reset();});

    Cart.updateBadge();
    go();
})();